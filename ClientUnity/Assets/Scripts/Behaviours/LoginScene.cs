using Facebook.Unity;
using GooglePlayGames;
using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class LoginScene : MonoBehaviour
{
    public GameObject GooglePlayLoginButton;
    public InputField InputPlayerName;
    public Text InputRoomId;
    public GameObject HelpPageObject;
    public GameObject LoginMethodObject;

    [HideInInspector] public bool HelpPageActive;

    private static Queue<Action> ReceivedActions = new Queue<Action>();

    private void Awake()
    {
        GameManager.Instance.LoginSceneBehaviour = this;
        if (GameManager.Instance.LocalName != null)
        {
            InputPlayerName.text = GameManager.Instance.LocalName;
        }
        HelpPageActive = false;
    }

    private void Start()
    {
#if !UNITY_ANDROID || UNITY_EDITOR
        GooglePlayLoginButton.SetActive(false);
#endif
#if UNITY_ANDROID
        if (PlayGamesPlatform.Instance.IsAuthenticated())
        {
            LoginMethodObject.GetComponent<LoginMethodTips>().SetLoginMethod(LoginMethod.GOOGLE_GAMES);
        }
#endif
    }

    private void Update()
    {
        while (ReceivedActions.Count > 0)
        {
            ReceivedActions.Dequeue()();
        }
    }

    public void OnClickStart()
    {
        if (InputPlayerName.text.Length > 0)
        {
            JSONObject data = JSONObject.Create();
            LoginMethodTips loginMethodTips = LoginMethodObject.GetComponent<LoginMethodTips>();
            string loginMethod = LoginMethod.DEVICE;
            string pid = SystemInfo.deviceUniqueIdentifier;
            string avatarURL = "";
            if (loginMethodTips.CurrentLoginMethod.Equals(LoginMethod.GOOGLE_GAMES))
            {
#if UNITY_ANDROID
                if (PlayGamesPlatform.Instance.IsAuthenticated())
                {
                    loginMethod = LoginMethod.GOOGLE_GAMES;
                    pid = PlayGamesPlatform.Instance.localUser.id;
                    avatarURL = ((PlayGamesUserProfile)PlayGamesPlatform.Instance.localUser).AvatarURL;
                }
#endif
            }
            else if (loginMethodTips.CurrentLoginMethod.Equals(LoginMethod.FACEBOOK))
            {
                if (FB.IsLoggedIn && !string.IsNullOrEmpty(loginMethodTips.FBPid))
                {
                    loginMethod = LoginMethod.FACEBOOK;
                    pid = loginMethodTips.FBPid;
                    avatarURL = loginMethodTips.FBAvatar;
                }
            }

            data.AddField("method", loginMethod);
            data.AddField("pid", pid);
            data.AddField("name", InputPlayerName.text);
            data.AddField("avatar", avatarURL);
            data.AddField("roomId", InputRoomId.text);
            GameManager.Instance.LoginMethod = loginMethod;
            GameManager.Instance.LoginPid = pid;
            GameManager.Instance.LocalName = InputPlayerName.text;
            GameManager.Instance.Emit(IOTypes.E_LOGIN, data);
            GameManager.Instance.InitiateSpin(SpinReason.REQUEST_NETWORK);
        }
        else
        {
            GameManager.Instance.ShowToast("Please enter your name");
        }
    }

    public void OnLoginGoogle()
    {
#if UNITY_ANDROID
        GameManager.Instance.InitiateSpin(SpinReason.SIGN_IN_GOOGLE_GAME);
        GameManager.Instance.ShowToast("Signing in with Google Games");
        Debug.Log("[GP]Start to Auth user with button");
        PlayGamesPlatform.Instance.localUser.Authenticate((bool success) =>
        {
            Debug.Log("[GP]button action, User login " + success);
            DispatchLoginGooglePlay(success);
        });
#endif
    }

    public void OnLoginFacebook()
    {
        GameManager.Instance.InitiateSpin(SpinReason.SIGN_IN_FACEBOOK);
        GameManager.Instance.ShowToast("Signing in with Facebook");
        Debug.Log("[FB]Start to Auth user with button");
        if (FB.IsInitialized)
        {
            FBOnInitComplete();
        }
        else
        {
            FB.Init(FBOnInitComplete, FBOnHideUnity);
        }
    }

    private void FBOnInitComplete()
    {
        Debug.Log("[FB] Init success");
        if (FB.IsLoggedIn)
        {
            Debug.Log("[FB] Already logged in, clicked FB button, changing login method to Facebook . . .");
            FBRequestData();
        }
        else
        {
            Debug.Log("[FB] Init but not logged in, logging in . . .");
            FB.LogInWithReadPermissions(new List<string>() { "public_profile" }, FBHandleLoginResult);
        }
    }

    protected void FBHandleLoginResult(IResult result)
    {
        if (result == null)
        {
            Debug.Log("[FB] Null Response");
            return;
        }

        //this.LastResponseTexture = null;

        // Some platforms return the empty string instead of null.
        if (!string.IsNullOrEmpty(result.Error))
        {
            Debug.Log("[FB] Error - Check log for details");
        }
        else if (result.Cancelled)
        {
            Debug.Log("[FB] Cancelled - Check log for details");
        }
        else if (!string.IsNullOrEmpty(result.RawResult))
        {
            Debug.Log("[FB] Success - Check log for details");
            Debug.Log(result.RawResult);
            FBRequestData();
        }
        else
        {
            Debug.Log("[FB] Empty Response");
        }

    }

    private void FBRequestData()
    {
        FB.API("/me?fields=picture{url},name", HttpMethod.GET, FBOnGraph);
    }

    private void FBOnGraph(IGraphResult result)
    {
        GameManager.Instance.HaltSpinner();
        if (string.IsNullOrEmpty(result.RawResult))
        {
            Debug.Log("[FB] graph nothing received");
            GameManager.Instance.ShowToast("Failed to login with Facebook");
        }
        else
        {
            Debug.Log("[FB] graph/me?fields=picture{url},name " + result.RawResult);
            JSONObject json = JSONObject.Create(result.RawResult);
            LoginMethodTips loginMethodTips = LoginMethodObject.GetComponent<LoginMethodTips>();
            loginMethodTips.SetLoginMethod(LoginMethod.FACEBOOK);
            loginMethodTips.FBPid = json.GetField("id").str;
            loginMethodTips.FBAvatar = json.GetField("picture").GetField("data").GetField("url").str.Replace("\\", string.Empty);
            InputPlayerName.text = json.GetField("name").str;
        }
    }

    private void FBOnHideUnity(bool isGameShown)
    {
    }

    internal static void DispatchLoginGooglePlay(bool success)
    {
#if UNITY_ANDROID
        ReceivedActions.Enqueue(() =>
        {
            Debug.Log("[GP]Login Google Play callback " + success);
            LoginScene self = GameManager.Instance.LoginSceneBehaviour;
            GameManager.Instance.HaltSpinner();
            if (success)
            {
                // Authenticated
                self.LoginMethodObject.GetComponent<LoginMethodTips>().SetLoginMethod(LoginMethod.GOOGLE_GAMES);
                self.InputPlayerName.text = PlayGamesPlatform.Instance.localUser.userName;
            }
            else
            {
                // Rejected
                self.LoginMethodObject.GetComponent<LoginMethodTips>().Hide();
                GameManager.Instance.ShowToast("Failed to login with Google");
            }
        });
#endif
    }

    public void OnClickedHelp()
    {
        HelpPageObject.SetActive(true);
        HelpPageActive = true;
    }

    public void OnClickedExitHelp()
    {
        HelpPageObject.SetActive(false);
        HelpPageActive = false;
    }

}
