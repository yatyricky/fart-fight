using System;
using UnityEngine;
using UnityEngine.UI;

public class LoginMethodTips : MonoBehaviour
{
    public const string CONTENT_PREFIX = "Login securely with ";

    public Text Content;

    [HideInInspector] public string CurrentLoginMethod = LoginMethod.DEVICE;
    [HideInInspector] public string FBPid = "";
    [HideInInspector] public string FBAvatar = "";

    public void Hide()
    {
        gameObject.SetActive(false);
    }

    public void SetLoginMethod(string str)
    {
        CurrentLoginMethod = str;
        gameObject.SetActive(true);
        if (CurrentLoginMethod.Equals(LoginMethod.GOOGLE_GAMES))
        {
            Content.text = CONTENT_PREFIX + "Google";
        }
        else if (CurrentLoginMethod.Equals(LoginMethod.FACEBOOK))
        {
            Content.text = CONTENT_PREFIX + "Facebook";
        }
        else
        {
            Hide();
        }
    }
}
