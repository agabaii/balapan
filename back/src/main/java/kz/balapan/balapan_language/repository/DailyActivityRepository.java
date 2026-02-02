// back/src/main/java/kz/balapan/balapan_language/repository/DailyActivityRepository.java
package kz.balapan.balapan_language.repository;

import kz.balapan.balapan_language.model.DailyActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyActivityRepository extends JpaRepository<DailyActivity, Long> {
    
    Optional<DailyActivity> findByUserIdAndActivityDate(Long userId, LocalDate activityDate);
    
    List<DailyActivity> findByUserIdOrderByActivityDateDesc(Long userId);
    
    @Query("SELECT da FROM DailyActivity da WHERE da.user.id = :userId AND da.activityDate >= :startDate ORDER BY da.activityDate DESC")
    List<DailyActivity> findRecentActivities(@Param("userId") Long userId, @Param("startDate") LocalDate startDate);
    
    @Query("SELECT COUNT(da) FROM DailyActivity da WHERE da.user.id = :userId AND da.activityDate >= :startDate AND da.activityDate <= :endDate")
    long countActiveDays(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(da.xpEarned) FROM DailyActivity da WHERE da.user.id = :userId AND da.activityDate >= :startDate AND da.activityDate <= :endDate")
    Integer getTotalXpInPeriod(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}