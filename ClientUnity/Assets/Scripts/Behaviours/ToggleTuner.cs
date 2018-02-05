using UnityEngine;
using UnityEngine.UI;

public class ToggleTuner : MonoBehaviour
{
    [Header("Props")]
    public Image BackgroundObject;
    public Sprite DeselectedSprite;
    public Sprite SelectedSprite;

    [Header("Siblings")]
    public GameObject Sibling1;
    public GameObject Sibling2;

    [HideInInspector] public bool IsSelected;

    private void Awake()
    {
        IsSelected = false;
    }

    public void OnClicked()
    {
        IsSelected = true;
        BackgroundObject.sprite = SelectedSprite;
        Sibling1.GetComponent<ToggleTuner>().Deselect();
        Sibling2.GetComponent<ToggleTuner>().Deselect();
    }

    public void Deselect()
    {
        IsSelected = false;
        BackgroundObject.sprite = DeselectedSprite;
    }
}
