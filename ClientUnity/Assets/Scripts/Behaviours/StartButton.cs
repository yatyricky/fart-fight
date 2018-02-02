using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using GooglePlayGames;

public class StartButton : MonoBehaviour
{

    public Text InputPlayerName;
    public Text InputRoomId;

    public void OnClickStart()
    {
        if (InputPlayerName.text.Length > 0)
        {
            JSONObject data = JSONObject.Create();
            data.AddField("name", InputPlayerName.text);
            data.AddField("roomId", InputRoomId.text);
            GameManager.Instance.Emit(IOTypes.E_LOGIN, data);
        }
        else
        {
            // toast 
            // please enter name
        }
    }

#if UNITY_ANDROID
    public void OnLoginGoogle()
    {
        LoginScene.DispatchInitiateSpinner();
        Debug.Log("[GP]Start to Auth user with button");
        PlayGamesPlatform.Instance.localUser.Authenticate((bool success) =>
        {
            Debug.Log("[GP]button action, User login " + success);
            LoginScene.DispatchLoginGooglePlay(success);
        });
    }
#endif
}
