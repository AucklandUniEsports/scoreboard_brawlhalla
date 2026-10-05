LoadEverything().then(() => {

  gsap.config({ nullTargetWarn: false, trialWarn: false });

  let startingAnimation = gsap
    .timeline({ paused: true })
    .from(
      [".fade"],
      {
        duration: 0.2,
        autoAlpha: 0,
        ease: "power2.out",
      },
      0
    )
    .from(
      [".scorebar"],
      {
        duration: 0.5,
        y: "+40px",
        ease: "expo.out",
        autoAlpha: 0,
      },
      0
    )
    .from(
      [".top_bar"],
      {
        duration: 0.5,
        x: "-60px",
        ease: "expo.out",
        autoAlpha: 0,
      },
      0
    )
    .from(
      [".team_tab:not(.text_empty)"],
      {
        duration: 0.4,
        y: "+20px",
        ease: "power2.out",
        autoAlpha: 0,
      },
      0.2
    )
    .from(
      [".score"],
      {
        duration: 0.4,
        scale: 0.7,
        ease: "expo.out",
        autoAlpha: 0,
      },
      0.15
    );

  Start = async () => {
    startingAnimation.restart();
  };

  // "🇺🇸 US | Seed 14" style line for the light strip under each name
  function InfoLine(player) {
    if (!player) return "";
    let parts = [];

    if (player.country && player.country.code) {
      parts.push(
        `${player.country.asset ? `<img class='flag' src='../../${player.country.asset.toLowerCase()}' />` : ""}${player.country.code}`
      );
    }
    if (player.seed) {
      parts.push(`Seed ${player.seed}`);
    } else if (player.twitter) {
      parts.push(`@${String(player.twitter).replace(/^@/, "")}`);
    }
    if (player.pronoun) {
      parts.push(player.pronoun);
    }

    return parts.join("<span class='sep'></span>");
  }

  Update = async (event) => {
    let data = event.data;
    let score = data.score[window.scoreboardNumber];

    let isTeams = Object.keys(score.team["1"].player).length > 1;
    $("body").toggleClass("singles", !isTeams);

    for (const [t, team] of [score.team["1"], score.team["2"]].entries()) {
      for (const p of [1, 2]) {
        let player = team.player[String(p)];
        let slot = `.p${t + 1}.slot.s${p}`;

        if (!player || (!isTeams && p > 1)) {
          SetInnerHtml($(`${slot} .name`), "");
          SetInnerHtml($(`${slot} .sponsor`), "");
          SetInnerHtml($(`${slot} .info`), "");
          continue;
        }

        SetInnerHtml($(`${slot} .sponsor`), player.team ? player.team : "");
        SetInnerHtml($(`${slot} .name`), await Transcript(player.name));
        SetInnerHtml($(`${slot} .info`), InfoLine(player));

        await CharacterDisplay(
          $(`${slot} .character_container`),
          {
            source: `score.${window.scoreboardNumber}.team.${t + 1}.player.${p}`,
            asset_key: "base_files/icon",
            slice_character: [0, 1],
            flip_x: t === 1,
          },
          event
        );
      }

      SetInnerHtml($(`.p${t + 1}.score`), String(team.score));

      SetInnerHtml(
        $(`.p${t + 1}.team_tab`),
        isTeams && team.teamName ? team.teamName : ""
      );

      SetInnerHtml(
        $(`.p${t + 1}.losers_container`),
        team.losers ? "<div class='losers'>LOSERS</div>" : ""
      );

      // OW overlay green/purple by default; TSH team colours only if opted in
      if (team.color && tsh_settings["useTeamColors"]) {
        document
          .querySelector(":root")
          .style.setProperty(`--p${t + 1}-accent`, team.color);
      }
    }

    SetInnerHtml($(".tournament_name"), data.tournamentInfo.tournamentName);
    SetInnerHtml($(".event_name"), data.tournamentInfo.eventName);
    $(".top_bar").toggleClass("no_event", !data.tournamentInfo.eventName);

    SetInnerHtml($(".phase"), score.phase);
    SetInnerHtml($(".match"), score.match);
    SetInnerHtml($(".best_of"), score.best_of_text);
  };
});
