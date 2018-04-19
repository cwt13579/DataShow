package com.wxb.datashow.web.enums;

/**
 * 操作的结果
 *
 * @author cwt
 */
public enum OpResult
{
    UNKNOWN("未知"), SUCCEED("成功"), FAILED("失败");
    private String note;

    private OpResult( String note )
    {
        this.note = note;
    }

    public String getNote()
    {
        return this.note;
    }

    public Integer getValue()
    {
        return this.ordinal();
    }

    public String getOrdinalStr()
    {
        return String.valueOf( this.ordinal() );
    }

    public static OpResult returnType( int ordinal )
    {
        return OpResult.values()[ordinal];
    }
}
