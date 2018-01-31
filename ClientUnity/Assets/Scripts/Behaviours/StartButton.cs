using UnityEngine;
using System.Collections;
using UnityEngine.UI;

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

}
