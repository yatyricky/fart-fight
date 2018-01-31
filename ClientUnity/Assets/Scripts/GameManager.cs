using UnityEngine;
using SocketIO;
using System.Collections.Generic;
using System;
using UnityEngine.SceneManagement;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance;

    public GameObject SocketIOObject;

    [HideInInspector] public List<PlayerData> PlayerDatas;
    [HideInInspector] public LoginScene LoginSceneBehaviour;
    [HideInInspector] public GameScene GameSceneBehaviour;
    [HideInInspector] public int LocalRoomId;
    [HideInInspector] public string LocalName;

    private SocketIOComponent _socket;
    private Queue<EmitMessage> _queuedEmits;


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
        LocalRoomId = -1;
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
    }

    private void LinkEstablishedCallback(SocketIOEvent e)
    {
        Debug.Log(">> link established");
        while (_queuedEmits.Count > 0)
        {
            EmitMessage em = _queuedEmits.Dequeue();
            Emit(em._ename, em._data);
        }
        if (LoginSceneBehaviour != null)
        {
            LoginSceneBehaviour.HaltSpinner();
        }
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
            LocalRoomId = (int)e.data.GetField("roomId").n;
            Scene s = SceneManager.GetSceneByBuildIndex(1);
            SceneManager.LoadScene(1);
            SceneManager.SetActiveScene(s);
        }
        else
        {
            string reason = e.data.GetField("reason").str;
            if (reason.Equals("room is full"))
            {
                Debug.Log("room full");

            }
            else if (reason.Equals("no such room"))
            {
                Debug.Log("no such room");
            }
        }
    }

    private void RunTimerCallback(SocketIOEvent e)
    {
        Debug.Log(">> run timer: " + e.data.ToString());
    }

    private void GameEndCallback(SocketIOEvent e)
    {
        Debug.Log(">> game end: " + e.data.ToString());
    }

    public void Emit(string ename, JSONObject data)
    {
        if (!_socket.IsConnected)
        {
            Debug.Log("socket not initiated, queueing");
            if (LoginSceneBehaviour != null)
            {
                LoginSceneBehaviour.InitiateSpinner();
            }
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

    class EmitMessage
    {
        public string _ename;
        public JSONObject _data;
    }

}
