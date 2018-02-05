using UnityEngine;

public class DedicatedSpinner : MonoBehaviour
{
    public GameObject PointerObject;

    [HideInInspector] public SpinReason Reason;

    private float _time;
    private bool _running;

    public void InitiateSpin(SpinReason reason)
    {
        _time = 0;
        _running = true;
        Reason = reason;
        PointerObject.transform.eulerAngles = new Vector3(0f, 0f, 0f);
        gameObject.SetActive(true);
    }

    private void Update()
    {
        if (_running == true)
        {
            _time += Time.deltaTime;
            PointerObject.transform.eulerAngles = new Vector3(0f, 0f, _time % 5.0f * -72f);
        }
        else
        {
            gameObject.SetActive(false);
        }
    }

    internal void Halt()
    {
        _running = false;
    }
}
