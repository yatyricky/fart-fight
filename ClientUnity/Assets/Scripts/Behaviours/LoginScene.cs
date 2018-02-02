using System;
using System.Collections.Generic;
using UnityEngine;

public class LoginScene : MonoBehaviour
{
    
    public GameObject NetworkSpinnerObject;
    public GameObject GooglePlayLoginButton;

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
            Debug.Log("[GP]Login Google Play callback");
            LoginScene self = GameManager.Instance.LoginSceneBehaviour;
            self._networkSpinner.Halt();
            if (success)
            {
                // Authenticated
                self.GooglePlayLoginButton.SetActive(false);
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
