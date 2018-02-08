using UnityEngine;

public class ExitDialogue : MonoBehaviour
{

    public void OnExitButtonPressed()
    {
        gameObject.SetActive(true);
        GameManager.Instance.GameSceneBehaviour.ExitPageActive = true;
    }

    public void OnDialogueDismiss()
    {
        gameObject.SetActive(false);
        GameManager.Instance.GameSceneBehaviour.ExitPageActive = false;
    }

    public void OnLeavePressed()
    {
        GameManager.Instance.PlayerLeave();
    }
}
