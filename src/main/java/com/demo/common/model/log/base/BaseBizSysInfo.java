package com.demo.common.model.log.base;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.IBean;

/**
 * Generated by JFinal, do not modify this file.
 */
@SuppressWarnings({"serial", "unchecked"})
public abstract class BaseBizSysInfo<M extends BaseBizSysInfo<M>> extends Model<M> implements IBean {

	public M setSysId(java.lang.String sysId) {
		set("sys_id", sysId);
		return (M)this;
	}
	
	public java.lang.String getSysId() {
		return getStr("sys_id");
	}

	public M setSysName(java.lang.String sysName) {
		set("sys_name", sysName);
		return (M)this;
	}
	
	public java.lang.String getSysName() {
		return getStr("sys_name");
	}

	public M setSysCode(java.lang.String sysCode) {
		set("sys_code", sysCode);
		return (M)this;
	}
	
	public java.lang.String getSysCode() {
		return getStr("sys_code");
	}

	public M setSysIp(java.lang.String sysIp) {
		set("sys_ip", sysIp);
		return (M)this;
	}
	
	public java.lang.String getSysIp() {
		return getStr("sys_ip");
	}

	public M setSysInfo(java.lang.String sysInfo) {
		set("sys_info", sysInfo);
		return (M)this;
	}
	
	public java.lang.String getSysInfo() {
		return getStr("sys_info");
	}

}
