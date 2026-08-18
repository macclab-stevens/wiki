OAI_NR_UE Configurations.md

link:
https://github.com/OPENAIRINTERFACE/openairinterface5g/blob/develop/doc/NR_SA_Tutorial_OAI_nrUE.md

```bash
eric@T450:~/openairinterface5g/cmake_targets/ran_build/build$ sudo ./nr-uesoftmodem -r 51 --numerology 1 --band 78 -C 3410100000 --ssb 4 -O ueConfig --uecap_file ../../../targets/PROJECTS/GENERIC-NR-5GC/CONF/uecap_ports1.xml
```

```bash
vi ./ueConfig
```
```
uicc0 = {
  imsi = "00101001234502";
  key = "82e9053a1882085ff2c020359938dae9";
  opc = "bfd5771aaf4f6728e9bc6ef2c2533bdb";
  pdu_sessions = ({ dnn = "internet"; nssai_sst = 1; });
}
```

```log
[INFO] [B200] Initialize Radio control...
[INFO] [B200] Performing register loopback test...
[INFO] [B200] Register loopback test passed
[INFO] [B200] Asking for clock rate 30.720000 MHz...
[INFO] [B200] Actually got clock rate 30.720000 MHz.
-- Using calibration table: calib_table_b210_38
[INFO] [B200] Asking for clock rate 30.720000 MHz...
[INFO] [B200] OK
[HW]     cal 0: freq 3500000000.000000, offset 44.000000, diff 89900000.000000
[HW]     cal 1: freq 2660000000.000000, offset 49.800000, diff 750100000.000000
[HW]     cal 2: freq 2300000000.000000, offset 51.000000, diff 1110100000.000000
[HW]     cal 3: freq 1880000000.000000, offset 53.000000, diff 1530100000.000000
[HW]     cal 4: freq 816000000.000000, offset 57.000000, diff 2594100000.000000
[HW]     RX Gain 0 110.000000 (44.000000) => 66.000000 (max 76.000000)
[HW]     USRP TX_GAIN:89.75 gain_range:89.75 tx_gain:0.00
[HW]     Setting clock source to internal
[HW]     Setting time source to internal
[HW]     Actual master clock: 30.720000MHz...
[HW]     Actual clock source internal...
[HW]     Actual time source internal...
[HW]     setting rx channel 0
[HW]     RF board max packet size 1916, size for 100µs jitter 3072
[HW]     rx_max_num_samps 1916
[HW]     RX Channel 0
[HW]       Actual RX sample rate: 30.720000MSps...
[HW]       Actual RX frequency: 3.410100GHz...
[HW]       Actual RX gain: 66.000000...
[HW]       Actual RX bandwidth: 20.000000M...
[HW]       Actual RX antenna: RX2...
[HW]     TX Channel 0
[HW]       Actual TX sample rate: 30.720000MSps...
[HW]       Actual TX frequency: 3.410100GHz...
[HW]       Actual TX gain: 89.750000...
[HW]       Actual TX bandwidth: 20.000000M...
[HW]       Actual TX antenna: TX/RX...
[HW]       Actual TX packet size: 1916
Using Device: Single USRP:
  Device: B-Series Device
  Mboard 0: B200
  RX Channel: 0
    RX DSP: 0
    RX Dboard: A
    RX Subdev: FE-RX1
  TX Channel: 0
    TX DSP: 0
    TX Dboard: A
    TX Subdev: FE-TX1

[HW]     Device timestamp: 0.743574...
[HW]     [RAU] has loaded USRP B200 device.
[HW]     current pps at 0.000000, starting streaming at 1.000000
[PHY]    Intializing UE Threads for instance 0 ...
[UTIL]   threadCreate() for UEthread_0: creating thread with affinity ffffffff, priority 97
[UTIL]   threadCreate() for L1_UE_stats_0: creating thread with affinity ffffffff, priority 1
TYPE <CTRL-C> TO TERMINATE
sleep...
sleep...
sleep...
sleep...
sleep...
sleep...
sleep...
sleep...
sleep...
Entering ITTI signals handler
TYPE <CTRL-C> TO TERMINATE
[PHY]    SSB position provided
[NR_PHY] Starting sync detection
[PHY]    [UE thread Synch] Running Initial Synch
[NR_PHY] Starting cell search with center freq: 3410100000, bandwidth: 51. Scanning for 1 number of GSCN.
[NR_PHY] Scanning GSCN: 0, with SSB offset: 4, SSB Freq: 0.000000
[PHY]    Initial sync: pbch decoded sucessfully, ssb index 0
[PHY]    pbch rx ok. rsrp:72 dB/RE, adjust_rxgain:-22 dB
[NR_PHY] Cell Detected with GSCN: 0, SSB SC offset: 4, SSB Ref: 0.000000, PSS Corr peak: 115 dB, PSS Corr Average: 77
[PHY]    [UE0] In synch, rx_offset 106160 samples
[PHY]    [UE 0] Measured Carrier Frequency offset -3489 Hz
[PHY]    Initial sync successful, PCI: 1
[PHY]    HW: Configuring channel 0 (rf_chain 0): setting tx_freq 3410096511 Hz, rx_freq 3410096511 Hz, tune_offset 0
Setting USRP TX Freq 3410096511.000000, RX Freq 3410096511.000000, tune_offset: 0.000000
[NR_RRC] [UE 0] BCCH update: phyCellID 0->1, arfcn_ssb 0->626976
[PHY]    Got synch: hw_slot_offset 14, carrier off -3489 Hz
[PHY]    UE synchronized! decoded_frame_rx=460 UE->init_sync_frame=1 trashed_frames=14
[PHY]    Resynchronizing RX by 106160 samples
[HW]     received write reorder clear context
[PHY]    max_pos_acc = 0, shiftForNextFrame = 0
[NR_RRC] SIB1 decoded
[NR_MAC] [UE 0] Initial cell selection: dl_frequency=3400920 kHz (from command-line, band=78, scs=1)
[NR_MAC] Computing frequency (nrarfcn 626728 => 3400920 KHz, NR band 78
[NR_MAC] Initial cell selection: uplink_frequency=3400920 kHz (from absoluteFrequencyPointA=626728, band=78, scs=1)
[NR_MAC] TDD period index = 6, based on the sum of dl_UL_TransmissionPeriodicity from Pattern1 (5.000000 ms) and Pattern2 (0.000000 ms): Total = 5.000000 ms
[NR_MAC] Set TDD configuration period to: 8 DL slots, 3 UL slots, 10 slots per period (NR_TDD_UL_DL_Pattern is 7 DL slots, 2 UL slots, 10 DL symbols, 2 UL symbols)
[NR_MAC] Configured 1 TDD patterns (total slots: pattern1 = 10, pattern2 = 0)
[PHY]    N_TA_offset changed from 0 to 400
[MAC]    Initialization of 4-Step CBRA procedure
[NR_MAC] [UE 0] selected PRACH occasion: start_symbol 0 fdm 0 slot 19 format 180
[NR_MAC] PRACH scheduler: Selected RO Frame 480, Slot 19, Symbol 0, Fdm 0
U[PHY]    PRACH [UE 0] in frame.slot 480.19, placing PRACH in position 1704, Msg1/MsgA-Preamble frequency start 11 (k1 11), preamble_offset 2, first_nonzero_root_idx 0, preambleIndex = 2
LLLLLLLL[MAC]    [UE 0] RAR reception failed
[NR_MAC] [UE 0] selected PRACH occasion: start_symbol 0 fdm 0 slot 19 format 180
[NR_MAC] PRACH scheduler: Selected RO Frame 482, Slot 19, Symbol 0, Fdm 0
[PHY]    PRACH [UE 0] in frame.slot 482.19, placing PRACH in position 1704, Msg1/MsgA-Preamble frequency start 11 (k1 11), preamble_offset 14, first_nonzero_root_idx 0, preambleIndex = 14
[PHY]    [UE 0] RAR-Msg2 decoded
[NR_MAC] [UE 0][RAPROC][RA-RNTI 010b] Got RAPID RAR subPDU
[NR_MAC] [UE 0][RAPROC][483.10] Found RAR with the intended RAPID 14
[MAC]    received TA command 67
[NR_MAC] [RAPROC][483.18] RA-Msg3 transmitted
[NR_MAC] [RAPROC][484.18] RA-Msg3 retransmitted
[NR_MAC] [UE 0][485.11][RAPROC] 4-Step RA procedure succeeded. CBRA: Contention Resolution is successful.
[NR_RRC] [UE0][RAPROC] Logical Channel DL-CCCH (SRB0), Received NR_RRCSetup
[RLC]    Added srb 1 to UE 0
[NR_RRC] State = NR_RRC_CONNECTED
[NAS]    Generate Initial NAS Message: Registration Request
[NAS]    [UE 0] Received NR_NAS_CONN_ESTABLISH_IND: asCause 0
[NR_RRC] [UE 0][RAPROC] Logical Channel UL-DCCH (SRB1), Generating RRCSetupComplete (bytes33)
[MAC]    [UE 0] Applying CellGroupConfig from gNodeB
[NR_MAC] NR_SRI_PUSCH_PowerControl not implemented, power control will not work as intended
LLLLLLLLLLLLLLLLLLLLLLL[NR_MAC] [495.0] Received TA_COMMAND 30 TAGID 0 CC_id 0
[NAS]    [UE 0] Received NAS_DOWNLINK_DATA_IND type FGS_AUTHENTICATION_REQUEST with length 42
kausf:cd ee 6b fb 4 99 c1 87 e2 26 27 71 8e 98 c 64 aa da dd 6d aa 69 f0 a9 17 4b 4e 12 76 ef ad 8f
kseaf:b5 e 1b 58 52 5c a7 98 97 e7 74 f2 6d ce e6 b5 2 43 5e 55 f7 59 ca f1 16 2 56 df f5 d8 d8 f3
kamf:8a 8f db 86 d8 c5 32 72 4b 3a 6b 31 34 c9 df e9 35 e8 2b ec d1 9b 44 67 27 d0 b1 52 32 6d ab 24
[NAS]    [UE 0] Received NAS_DOWNLINK_DATA_IND type FGS_SECURITY_MODE_COMMAND with length 19
knas_int: c9 c1 75 ce 20 a8 b5 cc c6 1e 66 b4 bf 8b e6 e8
knas_enc: c8 a ac d6 60 ab 9b 75 f9 9d e9 91 4a 6d 4a 8a
[NAS]    Generate Initial NAS Message: Registration Request
mac 36 82 ef fb
[NR_RRC] Received securityModeCommand (gNB 0)
[NR_RRC] Receiving from SRB1 (DL-DCCH), Processing securityModeCommand
[NR_RRC] Security algorithm is set to nea0
[NR_RRC] Integrity protection algorithm is set to nia2
[NR_RRC] deriving kRRCenc, kRRCint from KgNB=ea 2a 14 eb c1 fa 4f e8 31 4c a3 90 4d ba b9 de c3 be aa f6 ca ff 09 32 24 1d 88 25 30 7f 8e 91
[NR_RRC] Receiving from SRB1 (DL-DCCH), encoding securityModeComplete, rrc_TransactionIdentifier: 1
[NR_RRC] securityModeComplete payload: 2a 00 00 00 00 00 00 00 60 3a 00 68 9f 75 00 00
[NR_RRC] Received Capability Enquiry (gNB 0)
[NR_RRC] Receiving from SRB1 (DL-DCCH), Processing UECapabilityEnquiry
<UE-NR-Capability>
    <accessStratumRelease>
```
