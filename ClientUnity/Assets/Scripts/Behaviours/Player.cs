using System;
using System.Collections;
using UnityEngine;
using UnityEngine.UI;

public class Player : MonoBehaviour
{
    public Text NameObject;
    public Text ActObject;
    public Image PlayerFace;
    public SpriteRenderer Avatar;
    public GameObject WaitObject;
    public GameObject ReadyObject;
    public GameObject PlayObject;
    public GameObject DiedObject;
    public GameObject[] PowerObject;

    [HideInInspector] public int Power;

    private string _actFace;
    private string urlToLoad;

    private void Awake()
    {
        Power = 0;
        _actFace = "";
        urlToLoad = "";
    }

    internal void SetName(string name)
    {
        NameObject.text = name;
    }

    internal void SetPower(int val)
    {
        Power = val;
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
        GameScene gs = GameManager.Instance.GameSceneBehaviour;
        if (state.Equals("wait") || state.Equals("ready"))
        {
            PlayerFace.sprite = gs.FaceReady;
        }
        else if (state.Equals("died"))
        {
            PlayerFace.sprite = gs.FaceDied;
        }
        else
        {
            if (_actFace.Equals("charge"))
            {
                PlayerFace.sprite = gs.FaceCharge;
            }
            else if (_actFace.Equals("shock"))
            {
                PlayerFace.sprite = gs.FaceShock;
            }
            else if (_actFace.Equals("block"))
            {
                PlayerFace.sprite = gs.FaceBlock;
            }
            else if (_actFace.Equals("nuke"))
            {
                PlayerFace.sprite = gs.FaceNuke;
            }
            else
            {
                PlayerFace.sprite = gs.FaceReady;
            }
        }
    }

    internal void LoadAvatar(string avatarURL)
    {
        if (!urlToLoad.Equals(avatarURL) && !avatarURL.Equals(""))
        {
            urlToLoad = avatarURL;
            StartCoroutine(DownloadAvatarThread());
        }
    }

    private IEnumerator DownloadAvatarThread()
    {
        WWW www = new WWW(urlToLoad);
        Debug.Log("loadingggg");
        yield return www;
        Avatar.sprite = Sprite.Create(www.texture, new Rect(0.0f, 0.0f, www.texture.width, www.texture.height), new Vector2(0.5f, 0.5f), 100.0f);
        Debug.Log("Loading node dnoneee!!!");
    }
}
