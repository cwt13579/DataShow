package com.wxb.datashow.modules.product;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.demo.common.model.Product;
import com.demo.common.model.ProductLabel;
import com.demo.common.model.ProductRegion;
import com.demo.common.model.ProductRuleRelation;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.WsRes;

public class ProductController extends BaseController {

  public void index() {
    render("productList.jsp");
  }

  public void productListInvoke() {
    WsRes res = new WsRes();
    Page<Product> page = Product.dao.getAllProduct(getPageCurrent(), getPageSize(), getQueryMap());

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

  public void productAdd() {
    renderJsp("productAdd.jsp");
  }

  @Before({Tx.class})
  public void productSaveInvoke() {
    WsRes res = new WsRes();
    Product product = getModel(Product.class, "product");
    String[] periods = getParaValues("product.product_period");
    String[] interestWays = getParaValues("product.interest_way");
    product.setProductPeriod(StringUtils.join(periods,","));
    product.setInterestWay(StringUtils.join(interestWays,","));
    
    product.save();

    String[] regionIds = getParaValues("productRegion.region_id");
    ProductRegion.dao.deleteByProductId(product.getId().longValue());
    for (String item : regionIds) {
      ProductRegion productRegion = new ProductRegion();
      productRegion.setProductId(product.getId().longValue());
      productRegion.setRegionId(Long.valueOf(item));
      productRegion.save();
    }
    //处理label下拉框
    String[] labelIds = getParaValues("productLabel.label_id");
    ProductLabel.dao.deleteByProductId(product.getId().longValue());
    for (String item : labelIds) {
      ProductLabel productLabel = new ProductLabel();
      productLabel.setProductId(product.getId().longValue());
      productLabel.setLabelId(Long.valueOf(item));
      productLabel.save();
    }
    //处理产品规则
    String[] rules = getParaValues("productRuleRelation.rule_id");
    ProductRuleRelation.dao.deleteByProductId(product.getId().longValue());
    for (String item : rules) {
    	ProductRuleRelation productRuleRelation = new ProductRuleRelation();
    	productRuleRelation.setProductId(product.getId().longValue());
    	productRuleRelation.setRuleId(Long.valueOf(item));
    	productRuleRelation.save();
    }
    
    renderJson(res);
  }

  public void productEdit() throws Exception {
    String id = getPara("id");
    Product product = Product.dao.findById(id);
    List<ProductRegion> productRegions = ProductRegion.dao.getProductRegionByProductId(id);
    List<Long> regions = new ArrayList<Long>();
    for (ProductRegion item : productRegions) {
      regions.add(item.getRegionId());
    }
    List<ProductLabel> productLabels = ProductLabel.dao.getProductLabelByProductId(id);
    List<Long> labels = new ArrayList<Long>();
    for (ProductLabel item : productLabels) {
    	labels.add(item.getLabelId());
    }
    List<ProductRuleRelation> productRules = ProductRuleRelation.dao.getProductRuleByProductId(id);
    List<Long> rules = new ArrayList<Long>();
    for (ProductRuleRelation item : productRules) {
    	rules.add(item.getRuleId());
    }
    setAttr("product", product);
    setAttr("regions", StringUtils.join(regions,","));
    setAttr("labels", StringUtils.join(labels,","));
    setAttr("rules", StringUtils.join(rules,","));
    render("productEdit.jsp");
  }

  public void productUpdateInvoke() {
    WsRes res = new WsRes();
    Product product = getModel(Product.class, "product");
    String[] periods = getParaValues("product.product_period");
    String[] interestWays = getParaValues("product.interest_way");
    product.setProductPeriod(StringUtils.join(periods,","));
    product.setInterestWay(StringUtils.join(interestWays,","));
    product.update();

    //处理区域下拉框
    String[] regionIds = getParaValues("productRegion.region_id");
    ProductRegion.dao.deleteByProductId(product.getId().longValue());
    for (String item : regionIds) {
      ProductRegion productRegion = new ProductRegion();
      productRegion.setProductId(product.getId().longValue());
      productRegion.setRegionId(Long.valueOf(item));
      productRegion.save();
    }
    //处理label下拉框
    String[] labelIds = getParaValues("productLabel.label_id");
    ProductLabel.dao.deleteByProductId(product.getId().longValue());
    for (String item : labelIds) {
      ProductLabel productLabel = new ProductLabel();
      productLabel.setProductId(product.getId().longValue());
      productLabel.setLabelId(Long.valueOf(item));
      productLabel.save();
    }
    //处理产品规则
    String[] rules = getParaValues("productRuleRelation.rule_id");
    ProductRuleRelation.dao.deleteByProductId(product.getId().longValue());
    for (String item : rules) {
    	ProductRuleRelation productRuleRelation = new ProductRuleRelation();
    	productRuleRelation.setProductId(product.getId().longValue());
    	productRuleRelation.setRuleId(Long.valueOf(item));
    	productRuleRelation.save();
    }
 
    renderJson(res);
  }

  public void productDeleteInvoke() {
    WsRes res = new WsRes();
    String id = getPara("id");
    Product product = Product.dao.findById(id);
    product.delete();
    renderJson(res);
  }
  

}
