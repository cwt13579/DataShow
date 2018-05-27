package com.demo.common.model.base;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.IBean;

/**
 * Generated by JFinal, do not modify this file.
 */
@SuppressWarnings({"serial", "unchecked"})
public abstract class BaseFinance<M extends BaseFinance<M>> extends Model<M> implements IBean {

	public M setId(java.math.BigInteger id) {
		set("id", id);
		return (M)this;
	}
	
	public java.math.BigInteger getId() {
		return get("id");
	}

	public M setFinanceName(java.lang.String financeName) {
		set("finance_name", financeName);
		return (M)this;
	}
	
	public java.lang.String getFinanceName() {
		return getStr("finance_name");
	}

	public M setFinanceIntro(java.lang.String financeIntro) {
		set("finance_intro", financeIntro);
		return (M)this;
	}
	
	public java.lang.String getFinanceIntro() {
		return getStr("finance_intro");
	}

	public M setFinanceCode(java.lang.String financeCode) {
		set("finance_code", financeCode);
		return (M)this;
	}
	
	public java.lang.String getFinanceCode() {
		return getStr("finance_code");
	}

	public M setRemark(java.lang.String remark) {
		set("remark", remark);
		return (M)this;
	}
	
	public java.lang.String getRemark() {
		return getStr("remark");
	}

	public M setWeekInterest(java.math.BigDecimal weekInterest) {
		set("week_interest", weekInterest);
		return (M)this;
	}
	
	public java.math.BigDecimal getWeekInterest() {
		return get("week_interest");
	}

	public M setWeekInterest2(java.math.BigDecimal weekInterest2) {
		set("week_interest2", weekInterest2);
		return (M)this;
	}
	
	public java.math.BigDecimal getWeekInterest2() {
		return get("week_interest2");
	}

	public M setInvestMin(java.math.BigDecimal investMin) {
		set("invest_min", investMin);
		return (M)this;
	}
	
	public java.math.BigDecimal getInvestMin() {
		return get("invest_min");
	}

	public M setInvestMax(java.math.BigDecimal investMax) {
		set("invest_max", investMax);
		return (M)this;
	}
	
	public java.math.BigDecimal getInvestMax() {
		return get("invest_max");
	}

	public M setFinanceType(java.lang.Integer financeType) {
		set("finance_type", financeType);
		return (M)this;
	}
	
	public java.lang.Integer getFinanceType() {
		return getInt("finance_type");
	}

	public M setTermType(java.lang.Integer termType) {
		set("term_type", termType);
		return (M)this;
	}
	
	public java.lang.Integer getTermType() {
		return getInt("term_type");
	}

	public M setLogoPath(java.lang.String logoPath) {
		set("logo_path", logoPath);
		return (M)this;
	}
	
	public java.lang.String getLogoPath() {
		return getStr("logo_path");
	}

	public M setBannerPath(java.lang.String bannerPath) {
		set("banner_path", bannerPath);
		return (M)this;
	}
	
	public java.lang.String getBannerPath() {
		return getStr("banner_path");
	}

	public M setRelateProduct(java.lang.String relateProduct) {
		set("relate_product", relateProduct);
		return (M)this;
	}
	
	public java.lang.String getRelateProduct() {
		return getStr("relate_product");
	}

	public M setBackWay(java.lang.String backWay) {
		set("back_way", backWay);
		return (M)this;
	}
	
	public java.lang.String getBackWay() {
		return getStr("back_way");
	}

	public M setExt1(java.lang.String ext1) {
		set("ext1", ext1);
		return (M)this;
	}
	
	public java.lang.String getExt1() {
		return getStr("ext1");
	}

}
