import java.math.BigDecimal;
import java.util.Calendar;
import java.util.Date;



public class Test {

	public static void main(String args[]) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(new Date());
		int month = cal.get(Calendar.MONTH);
		int year = cal.get(Calendar.YEAR);
//		System.out.println(month);
//		System.out.println(year);
		
		BigDecimal result = BigDecimal.valueOf(2).divide(BigDecimal.valueOf(6),2, BigDecimal.ROUND_HALF_EVEN);
		System.out.println(result);
	}
}
