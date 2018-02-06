using UnityEngine;

public class ButtonClickSound : MonoBehaviour
{

    public void OnClickPlaySound()
    {
        GameManager.Instance.PlaySound(SoundTypes.BUTTON);
    }

}
