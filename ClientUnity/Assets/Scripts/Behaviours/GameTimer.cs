using UnityEngine;
using UnityEngine.UI;

public class GameTimer : MonoBehaviour
{
    public Image MaskObject;
    public GameObject PointerObject;

    private float _time;

    public void CountDown()
    {
        MaskObject.fillAmount = 1f;
        PointerObject.transform.eulerAngles = new Vector3(0f, 0f, 0f);
        _time = Configs.INTERVAL;
        gameObject.SetActive(true);
    }

    private void Update()
    {
        if (_time >= 0f)
        {
            _time -= Time.deltaTime;
            MaskObject.fillAmount = _time / Configs.INTERVAL;
            PointerObject.transform.eulerAngles = new Vector3(0f, 0f, (MaskObject.fillAmount - 1f) * 360f);
        }
        else
        {
            gameObject.SetActive(false);
        }
    }

}
