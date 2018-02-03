using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using DG.Tweening;
using System;

public class Toast : MonoBehaviour
{
    public Text MessageObject;

    public void Show(string message)
    {
        Debug.Log("Toast: " + message);
        MessageObject.text = message;
        gameObject.transform.position = new Vector3(0f, -300f, -0.2f);
        gameObject.SetActive(true);

        Sequence s = DOTween.Sequence();
        s.Insert(0f, gameObject.transform.DOMoveY(0f, 1.0f).SetEase(Ease.OutExpo));
        s.Insert(4f, gameObject.transform.DOMoveY(-300f, 0.3f));
        s.OnComplete(() =>
        {
            gameObject.SetActive(false);
        });
    }

}
