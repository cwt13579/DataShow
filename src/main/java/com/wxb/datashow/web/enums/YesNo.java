package com.wxb.datashow.web.enums;

/**
 * 操作的结果
 *
 * @author cwt
 */
public enum YesNo
{
    UNKNOWN("未知"), YES("是"), NO("否");
    private String note;

    private YesNo( String note )
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

    public static YesNo returnType( int ordinal )
    {
        return YesNo.values()[ordinal];
    }
}
