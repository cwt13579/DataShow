package com.demo.index;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.demo.common.model.StatisticsRecord;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.WsRes;

/**
 * 本 demo 仅表达最为粗浅的 jfinal 用法，更为有价值的实用的企业级用法 详见 JFinal 俱乐部:
 * http://jfinal.com/club
 * 
 * IndexController
 */
public class IndexController extends BaseController {
	public void index() {
		render("index.jsp");
	}

	public void getConsumerList() {
		this.render("consumerList.html");
	}

	public void getLibInOutList() {
		this.render("libInOutList.jsp");
	}

	/**
	 * 个人全国排名
	 */
	public void getTop10() {
		WsRes res = new WsRes();
		BigDecimal k1 = BigDecimal.valueOf(0.6);
		BigDecimal k2 = BigDecimal.valueOf(0.4);
		int standardRecommendedCount = StatisticsRecord.dao
				.getMaxPersonRecommendCount().getRecommendCount().intValue();
		List<StatisticsRecord> resultList = StatisticsRecord.dao
				.getStatisticsRecordList(k1, k2, standardRecommendedCount);
		List<String> userLit = new ArrayList<String>();
		List<Double> scoreLit = new ArrayList<Double>();

		// 计算综合得分
		if (resultList != null && resultList.size() > 0) {
			for (StatisticsRecord item : resultList) {
				BigDecimal v1 = BigDecimal.valueOf(item.getRecommendCount())
						.divide(BigDecimal.valueOf(standardRecommendedCount),
								2, BigDecimal.ROUND_HALF_EVEN);
				// BigDecimal v2 =
				// BigDecimal.valueOf(item.getDouble("transfer_rate"));
				// BigDecimal value =
				// v1.multiply(k1).add(v2.multiply(k2)).multiply(percent).setScale(2,
				// BigDecimal.ROUND_UP);
				// DecimalFormat df = new DecimalFormat("0.00");
				// String str = df.format(value);

				BigDecimal value = item.getBigDecimal("score").setScale(2,
						BigDecimal.ROUND_UP);
				item.put("score", value);
				userLit.add(item.getUserName());
				scoreLit.add(value.doubleValue());
			}
		}

		Map<String, List> resultMap = new HashMap<String, List>();
		resultMap.put("userList", userLit);
		resultMap.put("scoreList", scoreLit);
		res.setData(resultMap);
		renderJson(res);
	}

	/**
	 * 机构全国排名
	 */
	public void getAllOrg() {
		WsRes res = new WsRes();
		BigDecimal k4 = BigDecimal.valueOf(0.4);
		BigDecimal k3 = BigDecimal.valueOf(0.3);
		int standardRecommendedCount = StatisticsRecord.dao
				.getMaxPersonRecommendCountByOrg().getRecommendCount()
				.intValue();
		List<StatisticsRecord> resultList = StatisticsRecord.dao
				.getOrgStatisticsRecordList(standardRecommendedCount, k3, k4);
		List<String> orgLit = new ArrayList<String>();
		List<Double> scoreLit = new ArrayList<Double>();

		if (resultList != null && resultList.size() > 0) {
			for (StatisticsRecord item : resultList) {
				BigDecimal value = BigDecimal.valueOf(item.getDouble("score"))
						.setScale(2, BigDecimal.ROUND_UP);
				item.put("score", value);
				orgLit.add(item.getOrgName());
				scoreLit.add(value.doubleValue());
			}
		}
		Map<String, List> resultMap = new HashMap<String, List>();
		resultMap.put("orgList", orgLit);
		resultMap.put("scoreList", scoreLit);
		res.setData(resultMap);
		renderJson(res);
	}
}
