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
            case PlayerActions.CHARGE:
                act = "HOLD IN FART";
                break;
            case PlayerActions.SHOCK:
                act = "FART";
                break;
            case PlayerActions.BLOCK:
                act = "HOLD BREATH";
                break;
            case PlayerActions.NUKE:
                act = "HUGE STINKY FART";
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
            case PlayerStates.WAIT:
                ReadyObject.SetActive(false);
                PlayObject.SetActive(false);
                DiedObject.SetActive(false);
                WaitObject.SetActive(true);
                break;
            case PlayerStates.READY:
                WaitObject.SetActive(false);
                PlayObject.SetActive(false);
                DiedObject.SetActive(false);
                ReadyObject.SetActive(true);
                break;
            case PlayerStates.GAME:
                WaitObject.SetActive(false);
                ReadyObject.SetActive(false);
                DiedObject.SetActive(false);
                PlayObject.SetActive(true);
                break;
            case PlayerStates.DIED:
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
        if (state.Equals(PlayerStates.WAIT) || state.Equals(PlayerStates.READY))
        {
            PlayerFace.sprite = gs.FaceReady;
        }
        else if (state.Equals(PlayerStates.DIED))
        {
            PlayerFace.sprite = gs.FaceDied;
        }
        else
        {
            if (_actFace.Equals(PlayerActions.CHARGE))
            {
                PlayerFace.sprite = gs.FaceCharge;
            }
            else if (_actFace.Equals(PlayerActions.SHOCK))
            {
                PlayerFace.sprite = gs.FaceShock;
            }
            else if (_actFace.Equals(PlayerActions.BLOCK))
            {
                PlayerFace.sprite = gs.FaceBlock;
            }
            else if (_actFace.Equals(PlayerActions.NUKE))
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
        yield return www;
        Avatar.sprite = Sprite.Create(www.texture, new Rect(0.0f, 0.0f, www.texture.width, www.texture.height), new Vector2(0.5f, 0.5f), 100.0f);
    }
}
