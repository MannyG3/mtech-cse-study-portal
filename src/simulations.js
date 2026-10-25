// Interactive Simulation Algorithms for M.Tech CSE
import { parseClockToMinutes, KNAPSACK_MAX_CAPACITY } from './utils.js';

export function runKnapsackSim(notify) {
  try {
    const valInput = document.getElementById('knapValues');
    const wtInput = document.getElementById('knapWeights');
    const capInput = document.getElementById('knapCapacity');
    const outEl = document.getElementById('knapOutput');
    if (!valInput || !wtInput || !capInput || !outEl) return;

    const val = valInput.value.split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x));
    const wt = wtInput.value.split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x));
    const W = parseInt(capInput.value, 10);

    if (val.length !== wt.length || val.length === 0 || isNaN(W) || W < 0) {
      outEl.textContent = "Error: Values and weights must be matching non-empty lists, and capacity must be a non-negative integer.";
      return;
    }
    if (W > KNAPSACK_MAX_CAPACITY) {
      outEl.textContent = `Error: Capacity W is capped at ${KNAPSACK_MAX_CAPACITY} in the browser simulator.`;
      return;
    }

    const n = val.length;
    const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= W; w++) {
        if (wt[i - 1] <= w) {
          dp[i][w] = Math.max(dp[i - 1][w], val[i - 1] + dp[i - 1][w - wt[i - 1]]);
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    let res = dp[n][W];
    let currW = W;
    const selected = [];
    for (let i = n; i > 0 && res > 0; i--) {
      if (res !== dp[i - 1][currW]) {
        selected.push(`Item ${i} (Weight: ${wt[i - 1]}, Value: ${val[i - 1]})`);
        res -= val[i - 1];
        currW -= wt[i - 1];
      }
    }

    outEl.textContent =
      `Optimal Max Value: $${dp[n][W]}\n` +
      `Selected Items: ${selected.length ? selected.reverse().join(', ') : 'None'}\n` +
      `Bottom-up DP table computed in O(n*W) time.`;
    if (notify) notify("0/1 Knapsack optimal value calculated");
  } catch (err) {
    const outEl = document.getElementById('knapOutput');
    if (outEl) outEl.textContent = "Error: " + err.message;
  }
}

export function runPlatformsSim(notify) {
  try {
    const rawArr = document.getElementById('platArrivals')?.value.split(',').map(x => x.trim()).filter(Boolean) || [];
    const rawDep = document.getElementById('platDepartures')?.value.split(',').map(x => x.trim()).filter(Boolean) || [];
    const outEl = document.getElementById('platOutput');
    if (!outEl) return;

    const arr = rawArr.map(t => parseClockToMinutes(t)).filter(v => v != null).sort((a, b) => a - b);
    const dep = rawDep.map(t => parseClockToMinutes(t)).filter(v => v != null).sort((a, b) => a - b);

    if (!arr.length || arr.length !== dep.length) {
      outEl.textContent = "Error: Provide matching HH:MM arrival and departure lists.";
      return;
    }

    let i = 0, j = 0, current = 0, maxPlat = 0;
    const n = arr.length;
    while (i < n && j < n) {
      if (arr[i] <= dep[j]) {
        current++;
        if (current > maxPlat) maxPlat = current;
        i++;
      } else {
        current--;
        j++;
      }
    }

    outEl.textContent = `Minimum Platforms Needed: ${maxPlat}\nAlgorithm: Greedy activity intervals in O(n log n) time.`;
    if (notify) notify(`Minimum platforms required: ${maxPlat}`);
  } catch (err) {
    const outEl = document.getElementById('platOutput');
    if (outEl) outEl.textContent = "Error: " + err.message;
  }
}

export function runTwoGeneralsSim() {
  const dropProb = Math.min(0.9, Math.max(0, parseFloat(document.getElementById('lossProb')?.value) || 0.4));
  const outEl = document.getElementById('twoGeneralsOutput');
  if (!outEl) return;

  let output = "Two Generals Protocol Simulation:\n";
  let delivered = false;

  for (let r = 1; r <= 6; r++) {
    if (Math.random() >= dropProb) {
      output += `Attempt ${r}: Message 'ATTACK AT DAWN' acknowledged!\n`;
      delivered = true;
      break;
    }
    output += `Attempt ${r}: Packet dropped in transit. Retransmitting...\n`;
  }

  output += delivered
    ? "\nResult: Agreement established under bounded retransmissions."
    : "\nResult: Channel failed repeatedly. Illustrates impossibility of guaranteed consensus over unconfirmed lossy channels.";
  outEl.textContent = output;
}

export function runBullyElectionSim() {
  const failed = parseInt(document.getElementById('bullyFailedNode')?.value, 10) || 5;
  const initiator = parseInt(document.getElementById('bullyInitiator')?.value, 10) || 2;
  const outEl = document.getElementById('bullyOutput');
  if (!outEl) return;

  let output = `Bully Election Protocol Trace:\n`;
  output += `Status: Coordinator P${failed} has crashed.\n`;
  output += `P${initiator} detects heartbeat timeout and broadcasts ELECTION.\n`;

  const higherNodes = [3, 4, 5].filter(x => x > initiator && x !== failed);
  if (higherNodes.length > 0) {
    const winner = Math.max(...higherNodes);
    output += `Higher node P${winner} responds OK and broadcasts COORDINATOR.\n`;
    output += `\nResult: Node P${winner} elected new leader.`;
  } else {
    output += `No higher alive node responded.\n`;
    output += `\nResult: Node P${initiator} declares itself COORDINATOR.`;
  }
  outEl.textContent = output;
}
