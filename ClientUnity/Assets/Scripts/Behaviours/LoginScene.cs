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

    [HideInInspector] public bool HelpPageActive;

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
        HelpPageActive = false;
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
                self.GooglePlayLoginButton.SetActive(false);
                self.InputPlayerName.text = PlayGamesPlatform.Instance.localUser.userName;
            }
            else
            {
                // Rejected
                self.GooglePlayLoginButton.SetActive(true);
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

    public void OnClickShare()
    {
#if UNITY_ANDROID
        // Create Refernece of AndroidJavaClass class for intent
        AndroidJavaClass intentClass = new AndroidJavaClass("android.content.Intent");
        // Create Refernece of AndroidJavaObject class intent
        AndroidJavaObject intentObject = new AndroidJavaObject("android.content.Intent");

        // Set action for intent
        intentObject.Call<AndroidJavaObject>("setAction", intentClass.GetStatic<string>("ACTION_SEND"));

        intentObject.Call<AndroidJavaObject>("setType", "text/plain");

        //Set Subject of action
        intentObject.Call<AndroidJavaObject>("putExtra", intentClass.GetStatic<string>("EXTRA_SUBJECT"), "Fart Fight with me");
        //Set title of action or intent
        intentObject.Call<AndroidJavaObject>("putExtra", intentClass.GetStatic<string>("EXTRA_TITLE"), "Fart Fight with me");
        // Set actual data which you want to share
        intentObject.Call<AndroidJavaObject>("putExtra", intentClass.GetStatic<string>("EXTRA_TEXT"), "Hi, I've found this unique mini game.. suuuuper FUN! https://play.google.com/store/apps/details?id=app.smalltricks.fartfight");

        AndroidJavaClass unity = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
        AndroidJavaObject currentActivity = unity.GetStatic<AndroidJavaObject>("currentActivity");
        // Invoke android activity for passing intent to share data
        currentActivity.Call("startActivity", intentObject);
#endif
    }

}
