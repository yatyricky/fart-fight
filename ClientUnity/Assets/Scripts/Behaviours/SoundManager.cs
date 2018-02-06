using System;
using UnityEngine;

[RequireComponent(typeof(AudioSource))]
public class SoundManager : MonoBehaviour
{
    public AudioClip ButtonClick;
    public AudioClip Shock;
    public AudioClip Nuke;
    public AudioClip Ding;
    public GameObject BGMObject;

    private AudioSource audioSource;

    void Start()
    {
        audioSource = GetComponent<AudioSource>();
    }

    internal void PlayButtonSound()
    {
        audioSource.PlayOneShot(ButtonClick, 0.7F);
    }

    internal void PlayNukeSound()
    {
        audioSource.PlayOneShot(Nuke, 1F);
    }

    internal void PlayShockSound()
    {
        audioSource.PlayOneShot(Shock, 1F);
    }

    internal void PlayDingSound()
    {
        audioSource.PlayOneShot(Ding, 1F);
    }

    internal void LowerBGM()
    {
        AudioSource bgm = BGMObject.GetComponent<AudioSource>();
        bgm.volume = 0.1f;
    }

    internal void RestoreBGM()
    {
        AudioSource bgm = BGMObject.GetComponent<AudioSource>();
        bgm.volume = 0.375f;
    }
}
