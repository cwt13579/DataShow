package com.demo.utils.fileupload;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import com.jfinal.plugin.activerecord.Db;

public class PoiExt {
	public static Map<String, Object> ReadExcel(String filename, String sql,int colCount) throws FileNotFoundException {
	   FileInputStream fis = new FileInputStream(filename);
	   return ReadExcel(fis,sql,colCount);
	}
	public static Map<String, Object> ReadExcel(File file, String sql,int colCount) throws FileNotFoundException {
		   FileInputStream fis = new FileInputStream(file);
		   return ReadExcel(fis,sql,colCount);
		}
	public static Map<String, Object> ReadExcel(InputStream is, String sql,int ColCount) {
		Map<String, Object> map = null;
		try {
			@SuppressWarnings("resource")
			HSSFWorkbook wookbook = new HSSFWorkbook(is);
			HSSFSheet sheet = wookbook.getSheetAt(0);
			int rows = sheet.getPhysicalNumberOfRows();
			Object[][] paras = new Object[rows-1][ColCount];
			for (int i = 1; i < rows; i++) {
				HSSFRow row = sheet.getRow(i);
				if (row != null) {
					int cells = row.getPhysicalNumberOfCells();
					for (int j = 0; j < cells; j++) {
						HSSFCell cell = row.getCell(j);
						if (cell != null) {
							switch (cell.getCellType()) {
							case HSSFCell.CELL_TYPE_FORMULA:
								break;
							case HSSFCell.CELL_TYPE_NUMERIC:
								paras[i-1][j] = cell.getNumericCellValue();
								break;
							case HSSFCell.CELL_TYPE_STRING:
								paras[i-1][j] = cell.getStringCellValue();
								break;
							default:
								paras[i-1][j] = null;
								break;
							}
						}
					}
				}
			}
			int[] ret = Db.batch(sql, paras, 100);
			int s = 0, l = 0;
			for (int i = 0; i < ret.length; i++)
				if (ret[i] == 1)
					s++;
				else
					l++;
			map = new HashMap<String, Object>();
			map.put("success", s);
			map.put("lost", l);
			map.put("count", ret.length);
			wookbook = null;
		} catch (IOException e) {
			e.printStackTrace();
		}
		return map;
	}
}
