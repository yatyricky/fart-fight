using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using System;
using System.Linq;
using System.Collections.Generic;

public class GameScene : MonoBehaviour
{
    [Header("Tuners")]
    public GameObject NetworkSpinnerObject;
    public GameObject GameTimerObject;
    public Text RoomIdObject;
    public GameObject BattleResultObject;
    [Header("Players")]
    public GameObject[] OtherPlayerObjects;
    public GameObject LocalPlayerObject;
    [Header("Sprites")]
    public Sprite FaceReady;
    public Sprite FaceDied;
    public Sprite FaceCharge;
    public Sprite FaceShock;
    public Sprite FaceBlock;
    public Sprite FaceNuke;

    private NetworkSpinner _networkSpinner;
    private GameTimer _gameTimer;
    private GameManager _gm;

    private bool _roomIdUpdated;

    private void Awake()
    {
        _networkSpinner = NetworkSpinnerObject.GetComponent<NetworkSpinner>();
        _gm = GameObject.FindGameObjectWithTag("GameController").GetComponent<GameManager>();
        _gm.GameSceneBehaviour = this;
        _gameTimer = GameTimerObject.GetComponent<GameTimer>();
        _roomIdUpdated = false;
    }

    private void Start()
    {
        RefreshPlayers();
    }

    private void RefreshPlayers()
    {
        if (_gm.PlayerDatas.Count > 0)
        {
            Debug.Log("should update players");
            int otherIndex = 0;
            for (int i = 0; i < _gm.PlayerDatas.Count; i++)
            {
                PlayerData element = _gm.PlayerDatas.ElementAt(i);
                Player playerBehaviour;
                if (element.Name.Equals(_gm.LocalName))
                {
                    playerBehaviour = LocalPlayerObject.GetComponent<Player>();
                    LocalPlayerObject.GetComponent<LocalPlayer>().UpdateShockButton(element.Power);
                }
                else
                {
                    playerBehaviour = OtherPlayerObjects[otherIndex++].GetComponent<Player>();
                    playerBehaviour.gameObject.SetActive(true);
                }
                playerBehaviour.SetName(element.Name);
                playerBehaviour.SetPower(element.Power);
                playerBehaviour.SetAct(element.Act);
                playerBehaviour.SetState(element.State);
            }
            while (otherIndex < 3)
            {
                OtherPlayerObjects[otherIndex++].SetActive(false);
            }
            _gm.PlayerDatas.Clear();
        }
    }

    private void UpdateRoomId()
    {
        if (_roomIdUpdated == false && _gm.LocalRoomId != -1)
        {
            _roomIdUpdated = true;
            RoomIdObject.text = _gm.LocalRoomId.ToString();
        }
    }

    internal void HaltSpinner()
    {
        _networkSpinner.Halt();
    }

    internal void InitiateSpinner()
    {
        _networkSpinner.InitiateSpin();
    }

    private void Update()
    {
        RefreshPlayers();
        UpdateRoomId();
    }

    public void RunTimer()
    {
        _gameTimer.CountDown();
        LocalPlayerObject.GetComponent<LocalPlayer>().BlockButton.GetComponent<ToggleTuner>().OnClicked();
    }

    internal void ShowBattleResult(List<PlayerScore> list)
    {
        BattleResultObject.GetComponent<BattleResult>().Show(list);
    }
}
