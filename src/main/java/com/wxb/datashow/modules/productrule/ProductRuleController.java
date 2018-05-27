package com.wxb.datashow.modules.productrule;

import org.apache.commons.lang3.StringUtils;

import com.demo.common.model.ProductRule;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.WsRes;

public class ProductRuleController extends BaseController {

  public void index() {
    render("productRuleList.jsp");
  }

  public void productRuleListInvoke() {
    WsRes res = new WsRes();
    Page<ProductRule> page = ProductRule.dao.getAllProductRule(getPageCurrent(), getPageSize(), getQueryMap());
    // List<Product> list = page.getList();

    if (page != null) {
      res.setCode(WsRes.SUCCESS);
      res.setData(page);
      res.setMsg("成功");
    } else {
      res.setCode(WsRes.FAIL);
      res.setMsg("失败");
    }
    renderJson(res);
  }

  public void productRuleAdd() {
    renderJsp("productRuleAdd.jsp");
  }
  @Before({Tx.class})
  public void productRuleSaveInvoke() {
    WsRes res = new WsRes();
    ProductRule productRule = getModel( ProductRule.class, "productRule" );
    String[] loanWorks = getParaValues("productRule.loan_work");
    String[] loanHouses = getParaValues("productRule.loan_house");
    String[] loanInsurances = getParaValues("productRule.loan_insurance");
    String[] credits = getParaValues("productRule.loan_credit");
    String[] cars = getParaValues("productRule.loan_car");
    String[] bisyears = getParaValues("productRule.loan_bisyears");
    String[] workyears = getParaValues("productRule.loan_workyears");
    productRule.setLoanWork(StringUtils.join(loanWorks,","));
    productRule.setLoanHouse(StringUtils.join(loanHouses,","));
    productRule.setLoanInsurance(StringUtils.join(loanInsurances,","));
    productRule.setLoanCredit(StringUtils.join(credits,","));
    productRule.setLoanCar(StringUtils.join(cars,","));
    productRule.setLoanBisyears(StringUtils.join(bisyears,","));
    productRule.setLoanWorkyears(StringUtils.join(workyears,","));
    productRule.save();
    renderJson( res );
  }
  public void productRuleEdit() throws Exception {
    String id = getPara("id");
    ProductRule productRule = ProductRule.dao.findById(id);
    setAttr("productRule",productRule);
    render("productRuleEdit.jsp");
  }
  
  public void productRuleUpdateInvoke() {
    WsRes res = new WsRes();
    ProductRule productRule = getModel( ProductRule.class, "productRule" );
    String[] loanWorks = getParaValues("productRule.loan_work");
    String[] loanHouses = getParaValues("productRule.loan_house");
    String[] loanInsurances = getParaValues("productRule.loan_insurance");
    String[] credits = getParaValues("productRule.loan_credit");
    String[] cars = getParaValues("productRule.loan_car");
    String[] bisyears = getParaValues("productRule.loan_bisyears");
    String[] workyears = getParaValues("productRule.loan_workyears");
    productRule.setLoanWork(StringUtils.join(loanWorks,","));
    productRule.setLoanHouse(StringUtils.join(loanHouses,","));
    productRule.setLoanInsurance(StringUtils.join(loanInsurances,","));
    productRule.setLoanCredit(StringUtils.join(credits,","));
    productRule.setLoanCar(StringUtils.join(cars,","));
    productRule.setLoanBisyears(StringUtils.join(bisyears,","));
    productRule.setLoanWorkyears(StringUtils.join(workyears,","));
    productRule.update();
    renderJson( res );
  }
  
  public void productRuleDeleteInvoke() {
    WsRes res = new WsRes();
    String id = getPara("id");
    ProductRule productRule = ProductRule.dao.findById(id);
    productRule.delete();
    renderJson( res );
  }
}
