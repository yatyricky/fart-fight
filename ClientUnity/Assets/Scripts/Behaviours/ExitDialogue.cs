using UnityEngine;
using System.Collections;

public class ExitDialogue : MonoBehaviour
{

    public void OnExitButtonPressed()
    {
        gameObject.SetActive(true);
    }

    public void OnDialogueDismiss()
    {
        gameObject.SetActive(false);
    }

    public void OnLeavePressed()
    {
        GameManager.Instance.PlayerLeave();
    }
}
