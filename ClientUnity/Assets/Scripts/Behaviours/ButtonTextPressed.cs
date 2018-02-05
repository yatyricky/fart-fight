using UnityEngine;
using UnityEngine.EventSystems;

public class ButtonTextPressed : MonoBehaviour, IPointerDownHandler, IPointerUpHandler
{
    public GameObject TextObject;

    public void OnPointerDown(PointerEventData eventData)
    {
        TextObject.transform.Translate(new Vector3(3f, -13f, 0f));
    }

    public void OnPointerUp(PointerEventData eventData)
    {
        TextObject.transform.Translate(new Vector3(-3f, 13f, 0f));
    }

}
