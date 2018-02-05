using UnityEngine;
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

    private static Queue<Action> ReceivedActions = new Queue<Action>();

    private void Awake()
    {
        GameManager.Instance.GameSceneBehaviour = this;
    }

    private void Start()
    {
        RefreshPlayers();
    }

    private void Update()
    {
        RefreshPlayers();
        while (ReceivedActions.Count > 0)
        {
            ReceivedActions.Dequeue()();
        }
    }

    private void RefreshPlayers()
    {
        if (GameManager.Instance.PlayerDatas.Count > 0)
        {
            Debug.Log("should update players");
            int otherIndex = 0;
            for (int i = 0; i < GameManager.Instance.PlayerDatas.Count; i++)
            {
                PlayerData element = GameManager.Instance.PlayerDatas.ElementAt(i);
                Player playerBehaviour;
                if (element.LoginMethod.Equals(GameManager.Instance.LoginMethod) && element.Pid.Equals(GameManager.Instance.LoginPid))
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
            GameManager.Instance.PlayerDatas.Clear();
        }
    }

    internal static void DispatchUpdateRoomId(int roomId)
    {
        ReceivedActions.Enqueue(() =>
        {
            GameScene self = GameManager.Instance.GameSceneBehaviour;
            self.RoomIdObject.text = roomId.ToString();
        });
    }

    internal static void DispatchShowBattleResult(List<PlayerScore> list)
    {
        ReceivedActions.Enqueue(() =>
        {
            GameScene self = GameManager.Instance.GameSceneBehaviour;
            self.BattleResultObject.GetComponent<BattleResult>().Show(list);
        });
    }

    internal static void DispatchRunTimer()
    {
        ReceivedActions.Enqueue(() =>
        {
            GameScene self = GameManager.Instance.GameSceneBehaviour;
            self.GameTimerObject.GetComponent<GameTimer>().CountDown();
            self.LocalPlayerObject.GetComponent<LocalPlayer>().BlockButton.GetComponent<ToggleTuner>().OnClicked();
        });
    }
}
