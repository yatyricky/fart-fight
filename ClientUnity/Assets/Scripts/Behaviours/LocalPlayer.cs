using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class LocalPlayer : MonoBehaviour
{
    public GameObject ChargeButton;
    public GameObject ShockButton;
    public GameObject BlockButton;

    internal void UpdateShockButton(int power)
    {
        ToggleTuner checkBehaviour = ShockButton.GetComponent<ToggleTuner>();
        if (power >= Configs.NUKE_POWER)
        {
            checkBehaviour.TextObject.GetComponent<Text>().text = "HUGE STINKY FART";
        }
        else
        {
            checkBehaviour.TextObject.GetComponent<Text>().text = "FART";
        }
    }

    public void OnReadyClicked()
    {
        Debug.Log("clicked ready");
        JSONObject data = JSONObject.Create();
        data.AddField("method", GameManager.Instance.LoginMethod);
        data.AddField("pid", GameManager.Instance.LoginPid);
        GameManager.Instance.Emit(IOTypes.E_READY, data);
    }

    public void OnChargeClicked()
    {
        Debug.Log("clicked Charge");
        JSONObject data = JSONObject.Create();
        data.AddField("method", GameManager.Instance.LoginMethod);
        data.AddField("pid", GameManager.Instance.LoginPid);
        GameManager.Instance.Emit(IOTypes.E_CHARGE, data);
    }

    public void OnShockClicked()
    {
        Debug.Log("clicked Shock");
        Player playerBehaviour = gameObject.GetComponent<Player>();
        if (playerBehaviour.Power == 0)
        {
            Debug.Log("but not enough power, block checked instead");
            StartCoroutine(ForcePressBlock());
        }
        else if (playerBehaviour.Power >= Configs.NUKE_POWER)
        {
            JSONObject data = JSONObject.Create();
            data.AddField("method", GameManager.Instance.LoginMethod);
            data.AddField("pid", GameManager.Instance.LoginPid);
            GameManager.Instance.Emit(IOTypes.E_NUKE, data);
        }
        else
        {
            JSONObject data = JSONObject.Create();
            data.AddField("method", GameManager.Instance.LoginMethod);
            data.AddField("pid", GameManager.Instance.LoginPid);
            GameManager.Instance.Emit(IOTypes.E_SHOCK, data);
        }
    }

    IEnumerator ForcePressBlock()
    {
        yield return new WaitForSeconds(0.3f);
        BlockButton.GetComponent<ToggleTuner>().OnClicked();
    }

    public void OnBlockClicked()
    {
        Debug.Log("clicked Block");
        JSONObject data = JSONObject.Create();
        data.AddField("method", GameManager.Instance.LoginMethod);
        data.AddField("pid", GameManager.Instance.LoginPid);
        GameManager.Instance.Emit(IOTypes.E_BLOCK, data);
    }

}
