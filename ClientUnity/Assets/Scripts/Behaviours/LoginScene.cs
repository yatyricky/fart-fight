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

    private static Queue<Action> ReceivedActions = new Queue<Action>();

    private void Awake()
    {
        GameManager.Instance.LoginSceneBehaviour = this;
#if !UNITY_ANDROID || UNITY_EDITOR
        GooglePlayLoginButton.SetActive(false);
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
            data.AddField("name", InputPlayerName.text);
            data.AddField("roomId", InputRoomId.text);
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
            LoginScene.DispatchLoginGooglePlay(success);
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

}
