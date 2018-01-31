using System;
using UnityEngine;

public class NetworkSpinner : MonoBehaviour
{
    public GameObject PointerObject;

    private float _time;
    private bool _running;

    public void InitiateSpin()
    {
        _time = 0;
        _running = true;
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
