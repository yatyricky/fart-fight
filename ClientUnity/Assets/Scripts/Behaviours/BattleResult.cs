using UnityEngine;
using System.Collections;
using System;
using System.Collections.Generic;
using System.Linq;

public class BattleResult : MonoBehaviour
{
    public GameObject[] Entries;

    public void OnBackMaskClicked()
    {
        gameObject.SetActive(false);
        JSONObject data = JSONObject.Create();
        data.AddField("method", GameManager.Instance.LoginMethod);
        data.AddField("pid", GameManager.Instance.LoginPid);
        GameManager.Instance.Emit(IOTypes.E_CLOSE_RES, data);
    }

    internal void Show(List<PlayerScore> list)
    {
        int i;
        for (i = 0; i < list.Count; i++)
        {
            PlayerScore element = list.ElementAt(i);
            BattleResultEntry resBehav = Entries[i].GetComponent<BattleResultEntry>();
            resBehav.Name.text = element.Name;
            resBehav.Score.text = element.Score.ToString();
            Entries[i].SetActive(true);
        }
        for (; i < Entries.Length; i++)
        {
            Entries[i].SetActive(false);
        }
        gameObject.SetActive(true);
    }
}
