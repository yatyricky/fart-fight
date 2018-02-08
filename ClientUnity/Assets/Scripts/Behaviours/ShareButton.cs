using UnityEngine;
using System.Collections;

public class ShareButton : MonoBehaviour
{
    public void OnClickShare()
    {
#if UNITY_ANDROID
        // Create Refernece of AndroidJavaClass class for intent
        AndroidJavaClass intentClass = new AndroidJavaClass("android.content.Intent");
        // Create Refernece of AndroidJavaObject class intent
        AndroidJavaObject intentObject = new AndroidJavaObject("android.content.Intent");

        // Set action for intent
        intentObject.Call<AndroidJavaObject>("setAction", intentClass.GetStatic<string>("ACTION_SEND"));

        intentObject.Call<AndroidJavaObject>("setType", "text/plain");

        //Set Subject of action
        intentObject.Call<AndroidJavaObject>("putExtra", intentClass.GetStatic<string>("EXTRA_SUBJECT"), "Fart Fight with me");
        //Set title of action or intent
        intentObject.Call<AndroidJavaObject>("putExtra", intentClass.GetStatic<string>("EXTRA_TITLE"), "Fart Fight with me");
        // Set actual data which you want to share
        intentObject.Call<AndroidJavaObject>("putExtra", intentClass.GetStatic<string>("EXTRA_TEXT"), "Hi, I've found this unique mini game.. suuuuper FUN! https://play.google.com/store/apps/details?id=app.smalltricks.fartfight");

        AndroidJavaClass unity = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
        AndroidJavaObject currentActivity = unity.GetStatic<AndroidJavaObject>("currentActivity");
        // Invoke android activity for passing intent to share data
        currentActivity.Call("startActivity", intentObject);
#endif
    }

}
