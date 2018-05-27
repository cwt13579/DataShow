package com.demo.common.model.log.base;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.IBean;

/**
 * Generated by JFinal, do not modify this file.
 */
@SuppressWarnings({"serial", "unchecked"})
public abstract class BaseQrtzCronTriggers<M extends BaseQrtzCronTriggers<M>> extends Model<M> implements IBean {

	public M setSchedName(java.lang.String schedName) {
		set("SCHED_NAME", schedName);
		return (M)this;
	}
	
	public java.lang.String getSchedName() {
		return getStr("SCHED_NAME");
	}

	public M setTriggerName(java.lang.String triggerName) {
		set("TRIGGER_NAME", triggerName);
		return (M)this;
	}
	
	public java.lang.String getTriggerName() {
		return getStr("TRIGGER_NAME");
	}

	public M setTriggerGroup(java.lang.String triggerGroup) {
		set("TRIGGER_GROUP", triggerGroup);
		return (M)this;
	}
	
	public java.lang.String getTriggerGroup() {
		return getStr("TRIGGER_GROUP");
	}

	public M setCronExpression(java.lang.String cronExpression) {
		set("CRON_EXPRESSION", cronExpression);
		return (M)this;
	}
	
	public java.lang.String getCronExpression() {
		return getStr("CRON_EXPRESSION");
	}

	public M setTimeZoneId(java.lang.String timeZoneId) {
		set("TIME_ZONE_ID", timeZoneId);
		return (M)this;
	}
	
	public java.lang.String getTimeZoneId() {
		return getStr("TIME_ZONE_ID");
	}

}
