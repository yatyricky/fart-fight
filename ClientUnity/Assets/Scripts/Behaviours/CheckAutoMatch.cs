using UnityEngine;
using DG.Tweening;
using UnityEngine.UI;

public class CheckAutoMatch : MonoBehaviour
{
    public GameObject InputRoomIdObject;
    public InputField InputRoomIdField;
    public GameObject CheckTickObject;

    private bool isChecked;

    private void Awake()
    {
        isChecked = true;
    }

    public void OnClickCheck()
    {
        if (isChecked)
        {
            isChecked = false;
            CheckTickObject.SetActive(false);
            InputRoomIdObject.SetActive(true);
            gameObject.transform.DOMoveY(-258f, 0.5f).SetEase(Ease.OutCubic);
        }
        else
        {
            isChecked = true;
            CheckTickObject.SetActive(true);
            InputRoomIdObject.SetActive(false);
            InputRoomIdField.text = "";
            gameObject.transform.DOMoveY(-130f, 0.5f).SetEase(Ease.OutCubic);
        }
    }

}
