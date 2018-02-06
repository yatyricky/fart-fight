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

    private static Queue<Action> ReceivedActions = new Queue<Action>();

    private void Awake()
    {
        GameManager.Instance.LoginSceneBehaviour = this;
#if !UNITY_ANDROID || UNITY_EDITOR
        GooglePlayLoginButton.SetActive(false);
#endif
#if UNITY_ANDROID
        if (PlayGamesPlatform.Instance.IsAuthenticated())
        {
            GooglePlayLoginButton.SetActive(false);
        }
#endif
        if (GameManager.Instance.LocalName != null)
        {
            InputPlayerName.text = GameManager.Instance.LocalName;
        }
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
            string loginMethod = LoginMethod.DEVICE;
            string pid = SystemInfo.deviceUniqueIdentifier;
            string avatarURL = "";
#if UNITY_ANDROID
            if (PlayGamesPlatform.Instance.IsAuthenticated())
            {
                loginMethod = LoginMethod.GOOGLE_GAMES;
                pid = PlayGamesPlatform.Instance.localUser.id;
                avatarURL = ((PlayGamesUserProfile)PlayGamesPlatform.Instance.localUser).AvatarURL;
            }
#endif
            data.AddField("method", loginMethod);
            data.AddField("pid", pid);
            data.AddField("name", InputPlayerName.text);
            data.AddField("avatar", avatarURL);
            data.AddField("roomId", InputRoomId.text);
            GameManager.Instance.LoginMethod = loginMethod;
            GameManager.Instance.LoginPid = pid;
            GameManager.Instance.LocalName = InputPlayerName.text;
            GameManager.Instance.Emit(IOTypes.E_LOGIN, data);
        }
        else
        {
            GameManager.Instance.ShowToast("Please enter your name");
        }
    }

#if UNITY_ANDROID
    public void OnLoginGoogle()
    {
        GameManager.Instance.InitiateSpin(SpinReason.SIGN_IN_GOOGLE_GAME);
        GameManager.Instance.ShowToast("Signing in with Google Games");
        Debug.Log("[GP]Start to Auth user with button");
        PlayGamesPlatform.Instance.localUser.Authenticate((bool success) =>
        {
            Debug.Log("[GP]button action, User login " + success);
            DispatchLoginGooglePlay(success);
        });
    }

    internal static void DispatchLoginGooglePlay(bool success)
    {
        ReceivedActions.Enqueue(() =>
        {
            Debug.Log("[GP]Login Google Play callback " + success);
            LoginScene self = GameManager.Instance.LoginSceneBehaviour;
            GameManager.Instance.HaltSpinner();
            if (success)
            {
                // Authenticated
                self.GooglePlayLoginButton.SetActive(false);
                self.InputPlayerName.text = PlayGamesPlatform.Instance.localUser.userName;
            }
            else
            {
                // Rejected
                self.GooglePlayLoginButton.SetActive(true);
            }
        });
    }
#endif

    public void OnClickedHelp()
    {
        HelpPageObject.SetActive(true);
    }

    public void OnClickedExitHelp()
    {
        HelpPageObject.SetActive(false);
    }

}
