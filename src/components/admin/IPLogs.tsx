"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Loader2,
  RefreshCw,
  Activity,
  Globe,
  TrendingUp,
  Trash2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface IPLog {
  id: string;
  ipAddress: string;
  userAgent: string | null;
  referer: string | null;
  path: string;
  method: string;
  userId: string | null;
  sessionId: string | null;
  // Traffic source
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
  trafficSource?: string | null;
  trafficMedium?: string | null;
  detectionMethod?: string | null;
  // Bot detection
  isSuspicious?: boolean;
  botScore?: number | null;
  clickRate?: number | null;
  // Geolocation
  country?: string | null;
  countryCode?: string | null;
  city?: string | null;
  region?: string | null;
  timezone?: string | null;
  isp?: string | null;
  // Device info
  deviceType?: string | null;
  deviceBrand?: string | null;
  deviceModel?: string | null;
  browserName?: string | null;
  browserVersion?: string | null;
  osName?: string | null;
  osVersion?: string | null;
  createdAt: string;
}

interface Stats {
  totalLogs: number;
  uniqueIPs: number;
  topPaths: Array<{ path: string; count: number }>;
  topIPs: Array<{ ipAddress: string; count: number }>;
  dailyStats: Array<{ date: string; count: number }>;
}

interface StorageInfo {
  totalRecords: number;
  normalRecords: number;
  suspiciousRecords: number;
  oldestNormalRecord: string | null;
  oldestSuspiciousRecord: string | null;
  estimatedStorage: string;
}

export const IPLogs: React.FC = () => {
  const { showToast } = useToast();
  const [ipLogs, setIpLogs] = useState<IPLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ipFilter, setIpFilter] = useState('');
  const [pathFilter, setPathFilter] = useState('');
  const [trafficSourceFilter, setTrafficSourceFilter] = useState('');
  const [suspiciousOnly, setSuspiciousOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, limit: 50 });
  const [activeTab, setActiveTab] = useState<'logs' | 'stats'>('logs');
  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [isLoadingStorage, setIsLoadingStorage] = useState(false);

  const fetchIPLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        ...(searchTerm && { search: searchTerm }),
        ...(ipFilter && { ipAddress: ipFilter }),
        ...(pathFilter && { path: pathFilter }),
        ...(trafficSourceFilter && { trafficSource: trafficSourceFilter }),
        ...(suspiciousOnly && { suspiciousOnly: 'true' }),
      });

      const response = await fetch(`/api/admin/ip-logs?${params}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'IP log listesi getirilemedi');
      }

      const data = await response.json();
      setIpLogs(data.ipLogs || []);
      setPagination(data.pagination || { total: 0, limit: 50 });
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('IP log yükleme hatası:', error);
      showToast('IP log listesi yüklenemedi', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm, ipFilter, pathFilter, trafficSourceFilter, suspiciousOnly, showToast]);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoadingStats(true);
      const response = await fetch('/api/admin/ip-logs/stats?days=7', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('İstatistikler getirilemedi');

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('İstatistik yükleme hatası:', error);
      showToast('İstatistikler yüklenemedi', 'error');
    } finally {
      setIsLoadingStats(false);
    }
  }, [showToast]);

  const fetchStorageInfo = useCallback(async () => {
    try {
      setIsLoadingStorage(true);
      const response = await fetch('/api/admin/ip-logs/storage-info', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Storage bilgileri getirilemedi');
      }

      const data = await response.json();
      setStorageInfo(data);
    } catch (error) {
      console.error('Storage bilgisi yükleme hatası:', error);
      showToast(
        error instanceof Error ? error.message : 'Depolama bilgileri yüklenemedi',
        'error'
      );
    } finally {
      setIsLoadingStorage(false);
    }
  }, [showToast]);

  const clearIPLogs = useCallback(async () => {
    setShowClearModal(true);
  }, []);

  const cleanupOldLogs = useCallback(async () => {
    if (!confirm('30 günden eski normal kayıtlar ve 90 günden eski bot kayıtları temizlenecek. Devam etmek istiyor musunuz?')) {
      return;
    }

    setIsClearing(true);
    try {
      const response = await fetch(`/api/admin/ip-logs/cleanup-old`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Eski log kayıtları temizlenemedi');
      }

      const data = await response.json();
      showToast(`${data.totalDeleted} eski kayıt temizlendi (${data.normalDeleted} normal, ${data.suspiciousDeleted} şüpheli)`, 'success');
      
      // Listeyi yenile
      if (activeTab === 'logs') {
        fetchIPLogs();
      } else {
        fetchStats();
        fetchStorageInfo();
      }
    } catch (error) {
      console.error('Eski log temizleme hatası:', error);
      showToast(error instanceof Error ? error.message : 'Eski log kayıtları temizlenemedi', 'error');
    } finally {
      setIsClearing(false);
    }
  }, [showToast, activeTab, fetchIPLogs, fetchStats, fetchStorageInfo]);

  const confirmClear = useCallback(async () => {
    setIsClearing(true);
    try {
      const response = await fetch('/api/admin/ip-logs/clear', {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('IP log kayıtları temizlenemedi');

      const data = await response.json();
      showToast(`${data.deletedCount} kayıt silindi`, 'success');
      setShowClearModal(false);
      
      // Listeyi yenile
      if (activeTab === 'logs') {
        fetchIPLogs();
      } else {
        fetchStats();
      }
    } catch (error) {
      console.error('IP log temizleme hatası:', error);
      showToast('IP log kayıtları temizlenemedi', 'error');
    } finally {
      setIsClearing(false);
    }
  }, [showToast, activeTab, fetchIPLogs, fetchStats]);

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchIPLogs();
    } else {
      fetchStats();
      fetchStorageInfo();
    }
  }, [activeTab, fetchIPLogs, fetchStats, fetchStorageInfo]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text: string | null, maxLength: number = 50) => {
    if (!text) return '-';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">IP Logları</h2>
          <p className="text-sm text-gray-600 mt-1">
            Bot ve sahte tıklama önleme sistemi
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => activeTab === 'logs' ? fetchIPLogs() : fetchStats()} variant="outline" disabled={isLoading || isLoadingStats}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading || isLoadingStats ? 'animate-spin' : ''}`} />
            Yenile
          </Button>
          <Button onClick={cleanupOldLogs} variant="outline" disabled={isClearing || isLoading || isLoadingStats}>
            {isClearing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Activity className="h-4 w-4 mr-2" />
            )}
            Eski Kayıtları Temizle
          </Button>
          <Button onClick={clearIPLogs} variant="destructive" disabled={isLoading || isLoadingStats}>
            <Trash2 className="h-4 w-4 mr-2" />
            Tümünü Temizle
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === 'logs' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('logs')}
        >
          <Activity className="h-4 w-4 mr-2" />
          Loglar
        </Button>
        <Button
          variant={activeTab === 'stats' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('stats')}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          İstatistikler
        </Button>
      </div>

      {activeTab === 'logs' ? (
        <>
          {/* Filtreler */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="IP, path veya user agent ile ara..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <Input
              type="text"
              placeholder="IP adresi filtrele"
              value={ipFilter}
              onChange={(e) => {
                setIpFilter(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-48"
            />
            <Input
              type="text"
              placeholder="Path filtrele"
              value={pathFilter}
              onChange={(e) => {
                setPathFilter(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-48"
            />
            <select
              value={trafficSourceFilter}
              onChange={(e) => {
                setTrafficSourceFilter(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-48 h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Tüm Trafik Kaynakları</option>
              <option value="google_ads">Google Ads</option>
              <option value="meta_ads">Meta Ads</option>
              <option value="google_organic">Google Organik</option>
              <option value="meta_organic">Meta Organik</option>
              <option value="organic">Organik</option>
              <option value="direct">Direkt</option>
              <option value="referral">Referans</option>
            </select>
            <Button
              variant={suspiciousOnly ? 'default' : 'outline'}
              onClick={() => {
                setSuspiciousOnly(!suspiciousOnly);
                setPage(1);
              }}
              className="w-full sm:w-auto"
            >
              {suspiciousOnly ? 'Şüpheli Aktiviteler' : 'Tüm Aktiviteler'}
            </Button>
          </div>

          {/* Tablo */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : ipLogs.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Henüz IP log kaydı yok</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">IP Adresi</TableHead>
                        <TableHead>Trafik Kaynağı</TableHead>
                        <TableHead>Ülke/Şehir</TableHead>
                        <TableHead>Cihaz</TableHead>
                        <TableHead>Tarayıcı/OS</TableHead>
                        <TableHead>Bot Skoru</TableHead>
                        <TableHead>Path</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Tarih</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ipLogs.map((log) => {
                        // IP adresini göster - localhost IP'leri için özel gösterim
                        const displayIP = (() => {
                          const ip = log.ipAddress || '';
                          // Localhost IP'leri için "Localhost" göster
                          if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost' || ip === 'unknown') {
                            return 'Localhost';
                          }
                          // Gerçek IP adreslerini olduğu gibi göster
                          return ip;
                        })();
                        
                        return (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm font-semibold text-gray-900 whitespace-nowrap">
                            {displayIP}
                          </TableCell>
                          <TableCell className="text-sm">
                            {log.trafficSource ? (
                              <div>
                                <span className={`px-2 py-1 rounded text-xs font-medium inline-block mb-1 ${
                                  log.trafficSource === 'google_ads' ? 'bg-blue-100 text-blue-800' :
                                  log.trafficSource === 'meta_ads' ? 'bg-purple-100 text-purple-800' :
                                  log.trafficSource === 'google_organic' ? 'bg-green-100 text-green-800' :
                                  log.trafficSource === 'meta_organic' ? 'bg-pink-100 text-pink-800' :
                                  log.trafficSource === 'organic' ? 'bg-emerald-100 text-emerald-800' :
                                  log.trafficSource === 'direct' ? 'bg-gray-100 text-gray-800' :
                                  log.trafficSource === 'referral' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {log.trafficSource === 'google_ads' ? 'Google Ads' :
                                   log.trafficSource === 'meta_ads' ? 'Meta Ads' :
                                   log.trafficSource === 'google_organic' ? 'Google Organik' :
                                   log.trafficSource === 'meta_organic' ? 'Meta Organik' :
                                   log.trafficSource === 'organic' ? 'Organik' :
                                   log.trafficSource === 'direct' ? 'Direkt' :
                                   log.trafficSource === 'referral' ? 'Referans' :
                                   log.trafficSource}
                                </span>
                                {log.utmCampaign && (
                                  <div className="text-xs text-gray-600 mt-1">
                                    {truncateText(log.utmCampaign, 30)}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {log.country || log.countryCode ? (
                              <div>
                                <div className="font-medium">
                                  {log.country || log.countryCode}
                                  {log.countryCode && log.countryCode !== log.country && (
                                    <span className="text-gray-500 ml-1">({log.countryCode})</span>
                                  )}
                                </div>
                                {log.city && (
                                  <div className="text-xs text-gray-600">{log.city}</div>
                                )}
                                {log.isp && (
                                  <div className="text-xs text-gray-500">{truncateText(log.isp, 30)}</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {log.deviceType ? (
                              <div>
                                <span className={`px-2 py-1 rounded text-xs font-medium inline-block mb-1 ${
                                  log.deviceType === 'mobile' ? 'bg-blue-100 text-blue-800' :
                                  log.deviceType === 'desktop' ? 'bg-green-100 text-green-800' :
                                  log.deviceType === 'tablet' ? 'bg-purple-100 text-purple-800' :
                                  (log.deviceType === 'bot' || log.userAgent?.toLowerCase().includes('bot')) ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {log.deviceType}
                                </span>
                                {log.deviceBrand && log.deviceModel && (
                                  <div className="text-xs text-gray-600 mt-1">
                                    {log.deviceBrand} {log.deviceModel}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {log.browserName || log.osName ? (
                              <div>
                                {log.browserName && (
                                  <div className="text-xs">
                                    <span className="font-medium">{log.browserName}</span>
                                    {log.browserVersion && (
                                      <span className="text-gray-500 ml-1">{log.browserVersion}</span>
                                    )}
                                  </div>
                                )}
                                {log.osName && (
                                  <div className="text-xs text-gray-600 mt-1">
                                    {log.osName}
                                    {log.osVersion && (
                                      <span className="text-gray-500 ml-1">{log.osVersion}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {log.botScore !== null && log.botScore !== undefined ? (
                              <div>
                                <span className={`px-2 py-1 rounded text-xs font-medium inline-block ${
                                  log.botScore >= 70 ? 'bg-red-100 text-red-800' :
                                  log.botScore >= 50 ? 'bg-orange-100 text-orange-800' :
                                  log.botScore >= 30 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {log.botScore}/100
                                </span>
                                {log.isSuspicious && (
                                  <div className="text-xs text-red-600 mt-1 font-medium">
                                    Şüpheli
                                  </div>
                                )}
                                {log.clickRate !== null && log.clickRate !== undefined && log.clickRate > 0 && (
                                  <div className="text-xs text-gray-600 mt-1">
                                    {log.clickRate} tık/dk
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm">{log.path}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              log.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                              log.method === 'POST' ? 'bg-green-100 text-green-800' :
                              log.method === 'CLICK' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {log.method === 'CLICK' ? 'Tıklama' : log.method}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">{formatDate(log.createdAt)}</TableCell>
                        </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t">
                    <p className="text-sm text-gray-600">
                      Sayfa {page} / {totalPages} (Toplam {pagination.total} kayıt)
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Önceki
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        Sonraki
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {isLoadingStats ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : stats ? (
            <>
              {/* Veritabanı Saklama Bilgisi */}
              {isLoadingStorage ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                </div>
              ) : storageInfo ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    📊 Veritabanı Saklama Bilgisi
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-800">Toplam Kayıt:</span>
                      <span className="font-semibold text-blue-900">{storageInfo.totalRecords.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800">Normal Kayıtlar:</span>
                      <span className="text-blue-700">{storageInfo.normalRecords.toLocaleString()} <span className="text-xs">(30 gün saklanır)</span></span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800">Bot Kayıtları:</span>
                      <span className="text-blue-700">{storageInfo.suspiciousRecords.toLocaleString()} <span className="text-xs">(90 gün saklanır)</span></span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800">Tahmini Depolama:</span>
                      <span className="font-semibold text-blue-900">{storageInfo.estimatedStorage}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-xs text-blue-700">
                        ⚠️ Otomatik temizleme: Vercel cron job ile yapılandırılabilir (şu an manuel)
                      </p>
                      {storageInfo.oldestNormalRecord && (
                        <p className="text-xs text-blue-700">
                          📅 En eski normal kayıt: {formatDate(storageInfo.oldestNormalRecord)}
                        </p>
                      )}
                      {storageInfo.oldestSuspiciousRecord && (
                        <p className="text-xs text-blue-700">
                          🤖 En eski bot kayıt: {formatDate(storageInfo.oldestSuspiciousRecord)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Özet İstatistikler */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-sm font-medium text-gray-600">Toplam Log</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalLogs.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-sm font-medium text-gray-600">Benzersiz IP</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.uniqueIPs.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-sm font-medium text-gray-600">Ortalama / IP</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.uniqueIPs > 0 ? Math.round(stats.totalLogs / stats.uniqueIPs) : 0}
                  </p>
                </div>
              </div>

              {/* En Çok Ziyaret Edilen Sayfalar */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">En Çok Ziyaret Edilen Sayfalar</h3>
                <div className="space-y-2">
                  {stats.topPaths.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="font-mono text-sm">{item.path}</span>
                      <span className="font-semibold">{item.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* En Aktif IP'ler */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">En Aktif IP&apos;ler</h3>
                <div className="space-y-2">
                  {stats.topIPs.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="font-mono text-sm">{item.ipAddress}</span>
                      <span className="font-semibold">{item.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">İstatistikler yüklenemedi</p>
            </div>
          )}
        </div>
      )}

      {/* Clear Confirmation Modal */}
      <Dialog open={showClearModal} onOpenChange={setShowClearModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">⚠️ Tüm IP Loglarını Temizle</DialogTitle>
            <DialogDescription>
              Bu işlem geri alınamaz!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-red-600 font-semibold mb-2">
              Dikkat: Bu işlem kalıcı olarak tüm IP log kayıtlarını silecektir.
            </p>
            <p className="mb-2">
              Bu işlem şunları içerir:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-700">
              <li>Tüm ziyaret kayıtları</li>
              <li>Tüm bot tespit kayıtları</li>
              <li>Tüm istatistik verileri</li>
              <li>Tüm trafik kaynağı bilgileri</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              Devam etmek istediğinizden emin misiniz?
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowClearModal(false)}
              disabled={isClearing}
            >
              İptal
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmClear}
              disabled={isClearing}
            >
              {isClearing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Siliniyor...
                </>
              ) : (
                'Evet, Tümünü Sil'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
