﻿using UnityEngine;
using SocketIO;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using GooglePlayGames;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance;

    public GameObject SocketIOObject;
    public GameObject DedicatedSpinnerObject;
    public GameObject ToastObject;

    [HideInInspector] public LoginScene LoginSceneBehaviour;
    [HideInInspector] public GameScene GameSceneBehaviour;
    [HideInInspector] public List<PlayerData> PlayerDatas;
    [HideInInspector] public string LocalName;

    private SocketIOComponent _socket;
    private Queue<EmitMessage> _queuedEmits;

    #region LIFECYCLES

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
        }
        else if (Instance != this)
        {
            Destroy(gameObject);
        }
        DontDestroyOnLoad(gameObject);

        _queuedEmits = new Queue<EmitMessage>();
        PlayerDatas = new List<PlayerData>();
    }

    private void OnEnable()
    {
        SceneManager.sceneLoaded += OnSceneLoaded;
    }

    void Start()
    {
        _socket = SocketIOObject.GetComponent<SocketIOComponent>();
        _socket.On(IOTypes.R_LINK_ESTABLISHED, LinkEstablishedCallback);
        _socket.On(IOTypes.R_CORRECT_NAME, CorrectNameCallback);
        _socket.On(IOTypes.R_UPDATE_PLAYERS, UpdatePlayersCallback);
        _socket.On(IOTypes.R_LOGIN_RESULT, LoginResultCallback);
        _socket.On(IOTypes.R_RUN_TIMER, RunTimerCallback);
        _socket.On(IOTypes.R_GAME_END, GameEndCallback);

#if UNITY_ANDROID
        // Google play login
        InitiateSpin(SpinReason.SIGN_IN_GOOGLE_GAME);
        ShowToast("Signing in with Google Games");
        Debug.Log("[GP]Start to Auth user");
        PlayGamesPlatform.Instance.localUser.Authenticate((bool success) =>
        {
            Debug.Log("[GP]User login " + success);
            LoginScene.DispatchLoginGooglePlay(success);
        });
#endif
    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            if (DedicatedSpinnerObject.GetComponent<DedicatedSpinner>().Reason.Equals(SpinReason.SIGN_IN_GOOGLE_GAME))
            {
                HaltSpinner();
            }
        }
    }

    #endregion

    #region SOCKET FUNCTIONS

    private void LinkEstablishedCallback(SocketIOEvent e)
    {
        Debug.Log(">> link established");
        while (_queuedEmits.Count > 0)
        {
            EmitMessage em = _queuedEmits.Dequeue();
            Emit(em._ename, em._data);
        }
        HaltSpinner();
    }

    private void CorrectNameCallback(SocketIOEvent e)
    {
        Debug.Log(">> correct name: " + e.data.ToString());
        LocalName = e.data.GetField("data").str;
    }

    private void UpdatePlayersCallback(SocketIOEvent e)
    {
        Debug.Log(">> update players: " + e.data.ToString());
        PlayerDatas.Clear();
        List<JSONObject> objects = e.data.GetField("data").list;
        foreach (JSONObject obj in objects)
        {
            PlayerDatas.Add(new PlayerData
            {
                Name = obj.GetField("name").str,
                Power = (int)obj.GetField("power").n,
                Act = obj.GetField("act").str,
                Face = obj.GetField("face").str,
                Score = (int)obj.GetField("score").n,
                State = obj.GetField("state").str
            });
        }
    }

    private void LoginResultCallback(SocketIOEvent e)
    {
        Debug.Log(">> login result: " + e.data.ToString());
        string res = e.data.GetField("res").str;
        if (res.Equals("success"))
        {
            Debug.Log("login success");
            int roomId = (int)e.data.GetField("roomId").n;
            GameScene.DispatchUpdateRoomId(roomId);
            SceneManager.LoadScene("Game");
        }
        else
        {
            string reason = e.data.GetField("reason").str;
            if (reason.Equals("room is full"))
            {
                Debug.Log("room full");
                ShowToast("Lift is full");

            }
            else if (reason.Equals("no such room"))
            {
                Debug.Log("no such room");
                ShowToast("No such lift");
            }
        }
    }

    private void RunTimerCallback(SocketIOEvent e)
    {
        Debug.Log(">> run timer");
        GameScene.DispatchRunTimer();
    }

    private void GameEndCallback(SocketIOEvent e)
    {
        Debug.Log(">> game end" + e.data.ToString());
        List<JSONObject> rawList = e.data.GetField("data").list;
        List<PlayerScore> list = new List<PlayerScore>();
        foreach (JSONObject obj in rawList)
        {
            list.Add(new PlayerScore
            {
                Name = obj.GetField("name").str,
                Score = (int)obj.GetField("score").n
            });
        }
        GameScene.DispatchShowBattleResult(list);
    }

    class EmitMessage
    {
        public string _ename;
        public JSONObject _data;
    }

    public void Emit(string ename, JSONObject data)
    {
        if (!_socket.IsConnected)
        {
            Debug.Log("socket not initiated, queueing");
            InitiateSpin(SpinReason.REQUEST_NETWORK);
            ShowToast("Connecting to server");
            _queuedEmits.Enqueue(new EmitMessage
            {
                _ename = ename,
                _data = data
            });
            _socket.Connect();
        }
        else
        {
            Debug.Log("socket initiated! emit: " + ename + " => " + data.ToString());
            _socket.Emit(ename, data);
        }
    }

    #endregion

    internal void PlayerLeave()
    {
        JSONObject data = JSONObject.Create();
        data.AddField("name", LocalName);
        Emit(IOTypes.E_LEAVE, data);

        SceneManager.LoadScene("Login");
    }

    private void OnSceneLoaded(Scene scene, LoadSceneMode mode)
    {
        Debug.Log("Scene loaded " + scene.name);
    }

    public void ShowToast(string message)
    {
        ToastObject.GetComponent<Toast>().Show(message);
    }

    // There is no time for caution!
    public void InitiateSpin(SpinReason reason)
    {
        DedicatedSpinnerObject.GetComponent<DedicatedSpinner>().InitiateSpin(reason);
    }

    public void HaltSpinner()
    {
        DedicatedSpinnerObject.GetComponent<DedicatedSpinner>().Halt();
    }

}
