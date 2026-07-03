const poolForm = document.getElementById('poolForm');
const recommendationsBox = document.getElementById('recommendations');

const ranges = {
  fc: { low: 3, high: 5, name: 'Free Chlorine' },
  cc: { low: 0, high: 0.2, name: 'Combined Chlorine' },
  ph: { low: 7.4, high: 7.8, name: 'pH' },
  ta: { low: 60, high: 80, name: 'Total Alkalinity' },
  ch: { low: 250, high: 450, name: 'Calcium Hardness' },
  cya: { low: 70, high: 80, name: 'CYA / Stabilizer' },
  salt: { low: 3000, high: 3600, name: 'Salt' }
};

function getValue(id) {
  const value = document.getElementById(id).value;
  return value === '' ? null : Number(value);
}

function addRecommendation(items, level, title, message) {
  items.push({ level, title, message });
}

function calculateRecommendations(values) {
  const items = [];

  if (values.fc !== null) {
    if (values.fc < ranges.fc.low) {
      addRecommendation(items, 'alert', 'Free Chlorine is low', 'Increase salt cell output, extend pump run time, or add liquid chlorine. Retest after circulation.');
    } else if (values.fc > ranges.fc.high) {
      addRecommendation(items, 'warning', 'Free Chlorine is high', 'Lower the salt cell percentage or reduce pump run time. Avoid adding more chlorine until it drops.');
    } else {
      addRecommendation(items, 'good', 'Free Chlorine is in range', 'No chlorine adjustment needed today.');
    }
  }

  if (values.cc !== null) {
    if (values.cc > ranges.cc.high) {
      addRecommendation(items, 'alert', 'Combined Chlorine is high', 'Shock the pool with liquid chlorine, run the pump, and retest. Check for heavy bather load, debris, or algae.');
    } else {
      addRecommendation(items, 'good', 'Combined Chlorine is in range', 'Water does not show signs of excess used-up chlorine.');
    }
  }

  if (values.ph !== null) {
    if (values.ph < ranges.ph.low) {
      addRecommendation(items, 'warning', 'pH is low', 'Raise pH carefully using soda ash or aeration. Retest before adding more.');
    } else if (values.ph > ranges.ph.high) {
      addRecommendation(items, 'warning', 'pH is high', 'Lower pH with muriatic acid. Salt pools often drift upward, so retest after circulation.');
    } else {
      addRecommendation(items, 'good', 'pH is in range', 'No pH adjustment needed today.');
    }
  }

  if (values.ta !== null) {
    if (values.ta < ranges.ta.low) {
      addRecommendation(items, 'warning', 'Total Alkalinity is low', 'Raise alkalinity using baking soda. Add gradually and retest.');
    } else if (values.ta > ranges.ta.high) {
      addRecommendation(items, 'warning', 'Total Alkalinity is high', 'Lower TA slowly with muriatic acid and aeration. High TA can cause pH to rise faster.');
    } else {
      addRecommendation(items, 'good', 'Total Alkalinity is in range', 'This is a good range for most saltwater pools.');
    }
  }

  if (values.ch !== null) {
    if (values.ch < ranges.ch.low) {
      addRecommendation(items, 'warning', 'Calcium Hardness is low', 'Add calcium hardness increaser to protect plaster and surfaces.');
    } else if (values.ch > ranges.ch.high) {
      addRecommendation(items, 'warning', 'Calcium Hardness is high', 'Watch for scaling. Keep pH closer to 7.4–7.6 and monitor CSI. Partial water replacement may be needed if it keeps rising.');
    } else {
      addRecommendation(items, 'good', 'Calcium Hardness is in range', 'No calcium adjustment needed today.');
    }
  }

  if (values.cya !== null) {
    if (values.cya < ranges.cya.low) {
      addRecommendation(items, 'warning', 'CYA is low', 'Add stabilizer to help protect chlorine from sunlight. Add slowly because CYA is hard to lower.');
    } else if (values.cya > ranges.cya.high) {
      addRecommendation(items, 'warning', 'CYA is high', 'Avoid adding more stabilizer. Partial water replacement is usually the practical way to lower CYA.');
    } else {
      addRecommendation(items, 'good', 'CYA is in range', 'This is a good stabilizer range for a saltwater pool.');
    }
  }

  if (values.salt !== null) {
    if (values.salt < ranges.salt.low) {
      addRecommendation(items, 'warning', 'Salt is low', 'Add pool salt based on your salt system manual. For a 16,000 gallon pool, 40 lb of salt raises salt by about 300 ppm.');
    } else if (values.salt > ranges.salt.high) {
      addRecommendation(items, 'warning', 'Salt is high', 'Do not add salt. Dilution with fresh water may be needed if the salt system shows a high-salt warning.');
    } else {
      addRecommendation(items, 'good', 'Salt is in range', 'No salt adjustment needed today.');
    }
  }

  if (values.temp !== null) {
    addRecommendation(items, 'good', 'Temperature recorded', `Water temperature recorded at ${values.temp}°F.`);
  }

  if (values.ph !== null && values.ch !== null && values.ph > 7.8 && values.ch > 450) {
    addRecommendation(items, 'alert', 'Scaling risk is elevated', 'High pH plus high calcium can cause calcium scale, especially in a salt cell. Lower pH first and inspect the salt cell for scale.');
  }

  if (values.fc !== null && values.cya !== null && values.fc < 3 && values.cya < 70) {
    addRecommendation(items, 'alert', 'Chlorine may be burning off quickly', 'Low chlorine with low CYA often means sunlight is consuming chlorine faster. Adjust CYA carefully and maintain FC.');
  }

  return items;
}

function renderRecommendations(items) {
  if (!items.length) {
    recommendationsBox.className = 'recommendations empty';
    recommendationsBox.textContent = 'Enter your water test results above to see what needs attention.';
    return;
  }

  recommendationsBox.className = 'recommendations';
  recommendationsBox.innerHTML = items.map(item => `
    <div class="recommendation-item ${item.level}">
      <strong>${item.title}</strong>
      <span>${item.message}</span>
    </div>
  `).join('');
}

poolForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const values = {
    fc: getValue('fc'),
    cc: getValue('cc'),
    ph: getValue('ph'),
    ta: getValue('ta'),
    ch: getValue('ch'),
    cya: getValue('cya'),
    salt: getValue('salt'),
    temp: getValue('temp')
  };

  const items = calculateRecommendations(values);
  renderRecommendations(items);
});

poolForm.addEventListener('reset', function() {
  setTimeout(() => renderRecommendations([]), 0);
});
