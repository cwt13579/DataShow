package com.wxb.datashow.web.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.web.enums.DataStatus;
import com.wxb.datashow.web.enums.OpResult;
import com.wxb.datashow.web.enums.YesNo;

/**
 * 用于页面Ajax调用获取常量列表
 */
public class EnumController extends BaseController
{
    // 数据状态
    public void dataStatusInvoke()
    {
        List<Map<String, String>> list = new ArrayList<Map<String, String>>();
        for( DataStatus status : DataStatus.values() )
        {
            if( DataStatus.ENABLED.equals( status ) || DataStatus.DISABLED.equals( status ) )
            {
                Map<String, String> map = new LinkedHashMap<String, String>();
                map.put( "value", status.getOrdinalStr() );
                map.put( "note", status.getNote() );
                list.add( map );
            }
        }
        renderJson( list );
    }

    // 成功失败
    public void opResultInvoke()
    {
        List<Map<String, String>> list = new ArrayList<Map<String, String>>();
        for( OpResult type : OpResult.values() )
        {
            if( !OpResult.UNKNOWN.equals( type ) )
            {
                Map<String, String> map = new HashMap<String, String>();
                map.put( "value", type.getOrdinalStr() );
                map.put( "note", type.getNote() );
                list.add( map );
            }
        }
        renderJson( list );
    }

    // 是否
    public void yesNoInvoke()
    {
        List<Map<String, String>> list = new ArrayList<Map<String, String>>();
        for( YesNo type : YesNo.values() )
        {
            if( !YesNo.UNKNOWN.equals( type ) )
            {
                Map<String, String> map = new HashMap<String, String>();
                map.put( "value", type.getOrdinalStr() );
                map.put( "note", type.getNote() );
                list.add( map );
            }
        }
        renderJson( list );
    }
    
}
