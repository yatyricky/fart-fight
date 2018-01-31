using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using System;

public class Player : MonoBehaviour
{
    public Text NameObject;
    public Text ActObject;
    public GameObject FaceObject;
    public GameObject WaitObject;
    public GameObject ReadyObject;
    public GameObject PlayObject;
    public GameObject DiedObject;
    public GameObject[] PowerObject;

    private int _power;
    private string _actFace;

    private void Awake()
    {
        _power = 0;
        _actFace = "";
    }

    internal void SetName(string name)
    {
        NameObject.text = name;
    }

    internal void SetPower(int val)
    {
        _power = val;
        int i = 0;
        while (i < val && i < Configs.NUKE_POWER)
        {
            PowerObject[i++].SetActive(true);
        }
        while (i < Configs.NUKE_POWER)
        {
            PowerObject[i++].SetActive(false);
        }
    }

    internal void SetAct(string val)
    {
        _actFace = val;
        string act = "";
        switch (val)
        {
            case "charge":
                act = "酝酿";
                break;
            case "shock":
                act = "放屁";
                break;
            case "block":
                act = "憋气";
                break;
            case "nuke":
                act = "大臭屁";
                break;
            default:
                break;
        }
        ActObject.text = act;
    }

    internal void SetState(string state)
    {
        switch (state)
        {
            case "wait":
                ReadyObject.SetActive(false);
                PlayObject.SetActive(false);
                DiedObject.SetActive(false);
                WaitObject.SetActive(true);
                break;
            case "ready":
                WaitObject.SetActive(false);
                PlayObject.SetActive(false);
                DiedObject.SetActive(false);
                ReadyObject.SetActive(true);
                break;
            case "game":
                WaitObject.SetActive(false);
                ReadyObject.SetActive(false);
                DiedObject.SetActive(false);
                PlayObject.SetActive(true);
                break;
            case "died":
                WaitObject.SetActive(false);
                ReadyObject.SetActive(false);
                PlayObject.SetActive(false);
                DiedObject.SetActive(true);
                break;
            default:
                break;
        }

        // set face
        SpriteRenderer faceSprite = FaceObject.GetComponent<SpriteRenderer>();
        GameScene gs = GameManager.Instance.GameSceneBehaviour;
        if (state.Equals("wait") || state.Equals("ready"))
        {
            faceSprite.sprite = gs.FaceReady;
        }
        else if (state.Equals("died"))
        {
            faceSprite.sprite = gs.FaceDied;
        }
        else
        {
            if (_actFace.Equals("charge"))
            {
                faceSprite.sprite = gs.FaceCharge;
            }
            else if (_actFace.Equals("shock"))
            {
                faceSprite.sprite = gs.FaceShock;
            }
            else if (_actFace.Equals("block"))
            {
                faceSprite.sprite = gs.FaceBlock;
            }
            else if (_actFace.Equals("nuke"))
            {
                faceSprite.sprite = gs.FaceNuke;
            }
            else
            {
                faceSprite.sprite = gs.FaceReady;
            }
        }
    }
}
