using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;

public class Toast : MonoBehaviour
{
    public Text MessageObject;

    public void Show(string message)
    {
        Debug.Log("Toast: " + message);
        MessageObject.text = message;
        gameObject.transform.position = new Vector3(0f, -708f, -0.1f);
        gameObject.SetActive(true);

        Sequence s = DOTween.Sequence();
        s.Insert(0f, gameObject.transform.DOMoveY(-236f, 1.0f).SetEase(Ease.OutExpo));
        s.Insert(4f, gameObject.transform.DOMoveY(-708f, 0.3f));
        s.OnComplete(() =>
        {
            gameObject.SetActive(false);
        });
    }

}
