using UnityEngine;

public class LoginScene : MonoBehaviour
{
    public GameObject NetworkSpinnerObject;

    private NetworkSpinner _networkSpinner;
    private GameManager _gm;

    private void Awake()
    {
        _networkSpinner = NetworkSpinnerObject.GetComponent<NetworkSpinner>();
        _gm = GameObject.FindGameObjectWithTag("GameController").GetComponent<GameManager>();
        _gm.LoginSceneBehaviour = this;
    }

    internal void HaltSpinner()
    {
        _networkSpinner.Halt();
    }

    internal void InitiateSpinner()
    {
        _networkSpinner.InitiateSpin();
    }
}
