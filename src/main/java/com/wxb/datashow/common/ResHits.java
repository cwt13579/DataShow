package com.wxb.datashow.common;


public class ResHits {
	private long total;
	private Object value;
	private Integer code = 1;

	public Integer getCode() {
		return code;
	}
	public void setCode(Integer code) {
		this.code = code;
	}
	public void setTotal(long total) {
		this.total = total;
	}
	public ResHits(long l, Object hits) {
		this.total=l;
		this.value=hits;
	}
	public long getTotal() {
		return total;
	}
	public void setTotal(Integer total) {
		this.total = total;
	}
	public Object getValue() {
		return value;
	}
	public void setValue(Object value) {
		this.value = value;
	}

}
