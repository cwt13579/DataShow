package com.wxb.datashow.modules.product;

import java.math.BigDecimal;

public class StatisticsTop10Vo {

	private String userAccount;
	private String userName;
	private String orgCode;
	private String orgName;
	private Integer recommendCount;
	private Integer applyCount;
    private BigDecimal transferRate;
    private BigDecimal score;
	protected String getUserAccount() {
		return userAccount;
	}
	protected void setUserAccount(String userAccount) {
		this.userAccount = userAccount;
	}
	protected String getUserName() {
		return userName;
	}
	protected void setUserName(String userName) {
		this.userName = userName;
	}
	protected String getOrgCode() {
		return orgCode;
	}
	protected void setOrgCode(String orgCode) {
		this.orgCode = orgCode;
	}
	protected String getOrgName() {
		return orgName;
	}
	protected void setOrgName(String orgName) {
		this.orgName = orgName;
	}
	protected Integer getRecommendCount() {
		return recommendCount;
	}
	protected void setRecommendCount(Integer recommendCount) {
		this.recommendCount = recommendCount;
	}
	protected Integer getApplyCount() {
		return applyCount;
	}
	protected void setApplyCount(Integer applyCount) {
		this.applyCount = applyCount;
	}
	protected BigDecimal getTransferRate() {
		return transferRate;
	}
	protected void setTransferRate(BigDecimal transferRate) {
		this.transferRate = transferRate;
	}
	protected BigDecimal getScore() {
		return score;
	}
	protected void setScore(BigDecimal score) {
		this.score = score;
	}
}
