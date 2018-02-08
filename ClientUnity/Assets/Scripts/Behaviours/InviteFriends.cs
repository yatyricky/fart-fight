using UnityEngine;
using System.Collections;

public class InviteFriends : MonoBehaviour
{

    public void OnClickDismiss()
    {
        gameObject.SetActive(false);
        GameManager.Instance.GameSceneBehaviour.TipsShareActive = false;
    }
}
