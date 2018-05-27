package com.demo.common.model.log.base;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.IBean;

/**
 * Generated by JFinal, do not modify this file.
 */
@SuppressWarnings({"serial", "unchecked"})
public abstract class BaseLogCollect<M extends BaseLogCollect<M>> extends Model<M> implements IBean {

	public M setCollectId(java.lang.String collectId) {
		set("collect_id", collectId);
		return (M)this;
	}
	
	public java.lang.String getCollectId() {
		return getStr("collect_id");
	}

	public M setCollectName(java.lang.String collectName) {
		set("collect_name", collectName);
		return (M)this;
	}
	
	public java.lang.String getCollectName() {
		return getStr("collect_name");
	}

	public M setCollectEsIndex(java.lang.String collectEsIndex) {
		set("collect_es_index", collectEsIndex);
		return (M)this;
	}
	
	public java.lang.String getCollectEsIndex() {
		return getStr("collect_es_index");
	}

	public M setCollectEsType(java.lang.String collectEsType) {
		set("collect_es_type", collectEsType);
		return (M)this;
	}
	
	public java.lang.String getCollectEsType() {
		return getStr("collect_es_type");
	}

	public M setCollectSchedule(java.lang.String collectSchedule) {
		set("collect_schedule", collectSchedule);
		return (M)this;
	}
	
	public java.lang.String getCollectSchedule() {
		return getStr("collect_schedule");
	}

	public M setSrcId(java.lang.String srcId) {
		set("src_id", srcId);
		return (M)this;
	}
	
	public java.lang.String getSrcId() {
		return getStr("src_id");
	}

	public M setStatus(java.lang.String status) {
		set("status", status);
		return (M)this;
	}
	
	public java.lang.String getStatus() {
		return getStr("status");
	}

}
