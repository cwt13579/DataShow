package com.wxb.datashow.common;

import java.util.UUID;

public class UUIDUtil {

	public static String getId() {
		return UUID.randomUUID().toString().replace("-", "");
	}
}
