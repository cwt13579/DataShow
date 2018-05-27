package com.demo.common.model.log.base;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.IBean;

/**
 * Generated by JFinal, do not modify this file.
 */
@SuppressWarnings({"serial", "unchecked"})
public abstract class BaseLogSourceInfo<M extends BaseLogSourceInfo<M>> extends Model<M> implements IBean {

	public M setSrcId(java.lang.String srcId) {
		set("src_id", srcId);
		return (M)this;
	}
	
	public java.lang.String getSrcId() {
		return getStr("src_id");
	}

	public M setSrcName(java.lang.String srcName) {
		set("src_name", srcName);
		return (M)this;
	}
	
	public java.lang.String getSrcName() {
		return getStr("src_name");
	}

	public M setSrcType(java.lang.String srcType) {
		set("src_type", srcType);
		return (M)this;
	}
	
	public java.lang.String getSrcType() {
		return getStr("src_type");
	}

	public M setSrcIp(java.lang.String srcIp) {
		set("src_ip", srcIp);
		return (M)this;
	}
	
	public java.lang.String getSrcIp() {
		return getStr("src_ip");
	}

	public M setSrcPort(java.lang.String srcPort) {
		set("src_port", srcPort);
		return (M)this;
	}
	
	public java.lang.String getSrcPort() {
		return getStr("src_port");
	}

	public M setSrcUser(java.lang.String srcUser) {
		set("src_user", srcUser);
		return (M)this;
	}
	
	public java.lang.String getSrcUser() {
		return getStr("src_user");
	}

	public M setSrcPass(java.lang.String srcPass) {
		set("src_pass", srcPass);
		return (M)this;
	}
	
	public java.lang.String getSrcPass() {
		return getStr("src_pass");
	}

	public M setSrcSql(java.lang.String srcSql) {
		set("src_sql", srcSql);
		return (M)this;
	}
	
	public java.lang.String getSrcSql() {
		return getStr("src_sql");
	}

	public M setSrcProtocol(java.lang.String srcProtocol) {
		set("src_protocol", srcProtocol);
		return (M)this;
	}
	
	public java.lang.String getSrcProtocol() {
		return getStr("src_protocol");
	}

	public M setSrcPath(java.lang.String srcPath) {
		set("src_path", srcPath);
		return (M)this;
	}
	
	public java.lang.String getSrcPath() {
		return getStr("src_path");
	}

	public M setSrcSeparator(java.lang.String srcSeparator) {
		set("src_separator", srcSeparator);
		return (M)this;
	}
	
	public java.lang.String getSrcSeparator() {
		return getStr("src_separator");
	}

	public M setSrcRegex(java.lang.String srcRegex) {
		set("src_regex", srcRegex);
		return (M)this;
	}
	
	public java.lang.String getSrcRegex() {
		return getStr("src_regex");
	}

	public M setLogstashConf(java.lang.String logstashConf) {
		set("logstash_conf", logstashConf);
		return (M)this;
	}
	
	public java.lang.String getLogstashConf() {
		return getStr("logstash_conf");
	}
	public M setFormatType(java.lang.String formatType) {
		set("format_type", formatType);
		return (M)this;
	}
	
	public java.lang.String getFormatType() {
		return getStr("format_type");
	}
}
