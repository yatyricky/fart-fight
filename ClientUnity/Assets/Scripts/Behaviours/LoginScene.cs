using GooglePlayGames;
using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class LoginScene : MonoBehaviour
{
    public GameObject NetworkSpinnerObject;
    public GameObject ToastObject;
    public GameObject GooglePlayLoginButton;
    public InputField InputPlayerName;
    public Text InputRoomId;

    private static Queue<Action> ReceivedActions = new Queue<Action>();
    private NetworkSpinner _networkSpinner;
    private GameManager _gm;

    private void Awake()
    {
        _networkSpinner = NetworkSpinnerObject.GetComponent<NetworkSpinner>();
        _gm = GameObject.FindGameObjectWithTag("GameController").GetComponent<GameManager>();
        _gm.LoginSceneBehaviour = this;

#if !UNITY_ANDROID || UNITY_EDITOR
        GooglePlayLoginButton.SetActive(false);
#endif
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
            DispatchToast("Please enter your name");
        }
    }

#if UNITY_ANDROID
    public void OnLoginGoogle()
    {
        DispatchInitiateSpinner();
        DispatchToast("Signing in with Google Games");
        Debug.Log("[GP]Start to Auth user with button");
        PlayGamesPlatform.Instance.localUser.Authenticate((bool success) =>
        {
            Debug.Log("[GP]button action, User login " + success);
            LoginScene.DispatchLoginGooglePlay(success);
        });
    }
#endif

    public static void DispatchInitiateSpinner()
    {
        ReceivedActions.Enqueue(() =>
        {
            GameManager.Instance.LoginSceneBehaviour._networkSpinner.InitiateSpin();
        });
    }

    public static void DispatchHaltSpinner()
    {
        ReceivedActions.Enqueue(() =>
        {
            GameManager.Instance.LoginSceneBehaviour._networkSpinner.Halt();
        });
    }

    public static void DispatchToast(string message)
    {
        ReceivedActions.Enqueue(() =>
        {
            GameManager.Instance.LoginSceneBehaviour.ToastObject.GetComponent<Toast>().Show(message);
        });
    }

    private void Update()
    {
        while (ReceivedActions.Count > 0)
        {
            ReceivedActions.Dequeue()();
        }
    }

#if UNITY_ANDROID
    internal static void DispatchLoginGooglePlay(bool success)
    {
        ReceivedActions.Enqueue(() =>
        {
            Debug.Log("[GP]Login Google Play callback " + success);
            LoginScene self = GameManager.Instance.LoginSceneBehaviour;
            self._networkSpinner.Halt();
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
